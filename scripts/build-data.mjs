// Genera los JSON de public/data a partir de los datos públicos de la beta de WoW Forever.
// Uso: npm run data   (vuelve a ejecutarlo tras el lanzamiento o cuando las fuentes se actualicen)
//
// Fuentes:
//  - foreverchanges.pro: objetos del cliente de Forever (tooltips, iconos, stats y procedencia) y misiones con su facción
//  - wowforevertalent.com: árboles de talentos y libro de hechizos del cazador
//  - wowforevertools.com: bestias domables con familia, nivel y zona
//  - wow-petopia.com: rangos de habilidades de mascota, coste en puntos de entrenamiento y bestias que los enseñan
import { mkdir, writeFile } from 'node:fs/promises';
import {
  ABILITIES_URL,
  decodeAstroValue,
  decodeHtmlEntities,
  fetchJson,
  fetchText,
  ITEMS_BASE_URL,
  PET_ABILITIES_URL,
  PETS_URL,
  QUESTS_URL,
  readTalentsProps,
  TALENTS_URL,
} from './data-sources.mjs';

const OUTPUT_DIR = new URL('../public/data/', import.meta.url);
const QUEST_LEVEL_MARGIN = 3;
/** La beta no deja pasar de este nivel: lo que hay por encima es planificado. */
const BETA_LEVEL_CAP = 30;

const ARMOR_CLASS = 4;
const WEAPON_CLASS = 2;
const AMMO_CLASS = 6;
const QUIVER_CLASS = 11;
const HUNTER_ARMOR_SUBCLASSES = [0, 2, 3]; // misceláneo (joyas), cuero, malla
const CLOTH_SUBCLASS = 1;
const HUNTER_WEAPON_SUBCLASSES = [0, 1, 2, 3, 6, 7, 8, 10, 13, 15, 18];
// Agilidad, intelecto, aguante, índice de golpe, crítico y celeridad, poder de ataque y poder de ataque a distancia
const HUNTER_STAT_KEYS = ['3', '5', '7', '31', '32', '36', '38', '39'];
const EQUIPPABLE_SLOTS = [
  'Head', 'Neck', 'Shoulder', 'Back', 'Chest', 'Wrist', 'Hands', 'Waist', 'Legs', 'Feet',
  'Finger', 'Trinket', 'Two-Hand', 'One-Hand', 'Main Hand', 'Off Hand', 'Ranged', 'Ammo', 'Bag',
];
const ALLIANCE_PLACES = [
  'Northshire Valley', 'Coldridge Valley', 'Shadowglen', 'Elwynn Forest', 'Dun Morogh', 'Teldrassil',
  'Westfall', 'Loch Modan', 'Darkshore', 'Redridge Mountains', 'Duskwood', 'Stormwind City',
  'Ironforge', 'Darnassus', 'The Stockade', 'Hall of Thanes',
];
const HORDE_PLACES = [
  'Valley of Trials', 'Durotar', 'Mulgore', 'Red Cloud Mesa', 'Camp Narache', 'Tirisfal Glades',
  'Deathknell', 'Silverpine Forest', 'The Barrens', 'Orgrimmar', 'Thunder Bluff', 'Undercity',
  'Ruins of Lordaeron',
];
const SOURCE_KINDS = {
  q: 'quest', Q: 'quest', v: 'vendor', C: 'crafted', m: 'creature', w: 'world', B: 'dungeon', R: 'rare',
};

function detectFaction(place) {
  if (!place) return 'both';
  if (place.startsWith('Horde')) return 'horde';
  if (place.startsWith('Alliance')) return 'alliance';
  const zone = place.replace(/^Rare, /, '').replace(/, (in Classic|from level \d+)$/, '');
  if (ALLIANCE_PLACES.includes(zone)) return 'alliance';
  if (HORDE_PLACES.includes(zone)) return 'horde';
  return 'both';
}

// Las misiones de Classic no indican facción en los datos de objetos: se cruzan con la lista de misiones
function buildQuestLookup(quests) {
  const questsByName = new Map();
  const questsByRewardId = new Map();
  for (const quest of quests) {
    questsByName.set(quest.n, [...(questsByName.get(quest.n) ?? []), quest]);
    for (const [rewardId] of quest.k ?? []) questsByRewardId.set(rewardId, [...(questsByRewardId.get(rewardId) ?? []), quest]);
  }
  return { questsByName, questsByRewardId };
}

function findRewardQuests(itemId, questName, questLookup) {
  const byReward = (questLookup.questsByRewardId.get(itemId) ?? []).filter((quest) => quest.n === questName);
  return byReward.length ? byReward : (questLookup.questsByName.get(questName) ?? []);
}

function buildSource(itemId, rawSource, questLookup) {
  if (!rawSource) return null;
  const [code, label, place, level] = rawSource;
  const source = {
    kind: SOURCE_KINDS[code] ?? 'other',
    label: label.replace(/^Quest: /, ''),
    place: place.replace(/, in Classic$/, '').replace(/^In Classic$/, ''),
    level: typeof level === 'number' && level < 99 ? level : null,
    faction: detectFaction(place),
  };
  if (source.kind !== 'quest') return source;
  const quests = findRewardQuests(itemId, source.label, questLookup);
  if (quests.length && quests.every((quest) => quest.s === 'a')) source.faction = 'alliance';
  else if (quests.length && quests.every((quest) => quest.s === 'h')) source.faction = 'horde';
  // Nivel realista para tener la recompensa: un poco por debajo del nivel de la misión, nunca antes de poder cogerla
  source.level ??= quests.length
    ? Math.min(...quests.map((quest) => Math.max(quest.m, quest.l - QUEST_LEVEL_MARGIN)))
    : null;
  return source;
}

function hasHunterStats(item) {
  return Object.keys(item.v ?? {}).some((statKey) => HUNTER_STAT_KEYS.includes(statKey));
}

function isHunterRelevant(item) {
  if (!EQUIPPABLE_SLOTS.includes(item.s)) return false;
  if (item.c === AMMO_CLASS || item.c === QUIVER_CLASS) return true;
  if (item.c === WEAPON_CLASS && item.s === 'Ranged') return HUNTER_WEAPON_SUBCLASSES.includes(item.u);
  if (item.q < 2 || !hasHunterStats(item)) return false;
  if (item.c === WEAPON_CLASS) return HUNTER_WEAPON_SUBCLASSES.includes(item.u);
  if (item.c !== ARMOR_CLASS) return false;
  return HUNTER_ARMOR_SUBCLASSES.includes(item.u) || (item.u === CLOTH_SUBCLASS && item.s === 'Back');
}

function parseAmmoDps(lines) {
  const match = lines.map((line) => line.match(/Adds ([\d.]+) damage per second/)).find(Boolean);
  return match ? Number(match[1]) : null;
}

function parseQuiverSpeed(lines) {
  const match = lines.map((line) => line.match(/ranged attack speed by (\d+)%/)).find(Boolean);
  return match ? Number(match[1]) : null;
}

async function buildItems() {
  const [newItems, changedItems, sameItems, sources, quests] = await Promise.all([
    ...['new', 'changed', 'same', 'sources'].map((file) => fetchJson(`${ITEMS_BASE_URL}/${file}.json`)),
    fetchJson(QUESTS_URL),
  ]);
  const questLookup = buildQuestLookup(quests);
  const rawItems = [...newItems.items, ...changedItems.items, ...sameItems.items];
  const items = rawItems.filter(isHunterRelevant).map((item) => {
    const tooltip = (item.x ?? []).filter((line) => !line.startsWith('Sell Price'));
    return {
      id: item.i,
      name: item.n,
      quality: item.q,
      itemLevel: item.l,
      requiredLevel: item.r ?? 0,
      slot: item.s,
      itemClass: item.c,
      itemSubclass: item.u,
      icon: item.k,
      status: item.t,
      tooltip,
      speed: item.p ?? null,
      dps: item.d ?? parseAmmoDps(tooltip),
      quiverSpeed: item.c === QUIVER_CLASS ? parseQuiverSpeed(tooltip) : null,
      stats: item.v ?? {},
      source: buildSource(item.i, sources.items[item.i], questLookup),
    };
  });
  return { build: newItems.forever_build, buildDate: newItems.forever_build_date, items };
}

async function buildTalents() {
  const html = await fetchText(TALENTS_URL);
  const props = readTalentsProps(html);
  const gameClass = decodeAstroValue(props.gameClass);
  return {
    source: gameClass.source,
    version: decodeAstroValue(props.version),
    trees: gameClass.trees.map((tree) => ({
      id: tree.id,
      name: tree.name,
      icon: tree.icon,
      talents: tree.talents.map((talent) => ({
        id: talent.id,
        name: talent.name,
        row: talent.row,
        column: talent.col,
        maxRank: talent.maxRank,
        icon: talent.icon,
        passive: talent.passive,
        prerequisiteId: talent.prerequisite ?? null,
        cost: talent.cost ?? null,
        ranks: talent.ranks.map((rank) => rank.text),
      })),
    })),
  };
}

async function buildAbilities() {
  const html = await fetchText(ABILITIES_URL);
  const abilities = [];
  for (const panel of html.split('data-book-panel="').slice(1)) {
    const school = panel.slice(0, panel.indexOf('"'));
    const cellPattern = /<li class="spell-cell"[^>]*data-tip="([^"]*)"[^>]*>[\s\S]*?<img src="\/assets\/icons\/([^".]+)\.jpg"/g;
    for (const [, rawTip, icon] of panel.matchAll(cellPattern)) {
      const tip = JSON.parse(decodeHtmlEntities(rawTip));
      for (const rank of tip.ranks) {
        if (rank.level === null) continue;
        abilities.push({
          name: tip.name,
          school,
          rank: rank.rankNumber ?? 0,
          level: rank.level,
          icon,
          status: rank.status,
          cost: rank.meta,
          description: rank.text,
        });
      }
    }
  }
  abilities.sort((first, second) => first.level - second.level || first.name.localeCompare(second.name));
  return { source: 'wowforevertalent.com (libro de hechizos de la beta)', abilities };
}

function readHtmlAttributes(tag) {
  return Object.fromEntries([...tag.matchAll(/data-([a-z]+)="([^"]*)"/g)].map(([, name, value]) => [name, decodeHtmlEntities(value)]));
}

async function buildPets() {
  const html = await fetchText(PETS_URL);
  const families = [...html.matchAll(/id="hp-panel-(\d+)"[^>]*aria-label="([^"]+) beasts"[\s\S]{0,400}?<img src="\/icons\/([a-z0-9_]+)\.jpg/g)].map(
    ([, id, name, icon]) => ({ id: Number(id), name: decodeHtmlEntities(name), icon }),
  );
  const beastsById = new Map();
  for (const [tag] of html.matchAll(/<a class="hp-chip[^>]*data-beast[^>]*>/g)) {
    const attributes = readHtmlAttributes(tag);
    if (beastsById.has(attributes.id)) continue;
    beastsById.set(attributes.id, {
      id: Number(attributes.id),
      name: attributes.title,
      familyId: Number(attributes.family),
      minLevel: attributes.min ? Number(attributes.min) : null,
      maxLevel: attributes.max ? Number(attributes.max) : null,
      zones: attributes.zones ? attributes.zones.split('|') : [],
      isRare: attributes.rare === '1',
    });
  }
  return { source: 'wowforevertools.com (bestias domables del cliente beta)', families, beasts: [...beastsById.values()] };
}

const PLURAL_FAMILY_NAMES = { Wolves: 'Wolf', Foxes: 'Fox', 'Birds of Prey': 'Bird of Prey' };

function stripHtml(html) {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}

function parsePetAbilityTeacher([, npcId, name, family, levels, zone]) {
  const [minLevel, maxLevel = minLevel] = levels.split('-').map(Number);
  return {
    id: Number(npcId),
    name: decodeHtmlEntities(name),
    family,
    minLevel: Number.isNaN(minLevel) ? null : minLevel,
    maxLevel: Number.isNaN(maxLevel) ? null : maxLevel,
    zone: zone.replace(/ \(Dungeon\)$/, ''),
    isDungeon: zone.endsWith('(Dungeon)'),
  };
}

function parsePetAbilityRank(rankHtml) {
  const header = rankHtml.match(/abilityrankname[^>]*>[^<]*?(\d+)<\/span>: Pet Level (\d+), Cost (\d+) TP/);
  if (!header) return null;
  const descriptionMatch = rankHtml.match(/abilityrankdesc[^>]*>([\s\S]*?)<span class='abilitysourceheading/);
  const teacherPattern = /npc=(\d+)'>([^<]+)<\/a> \(([^,]+), ([\d?-]+), (.+?)\)<\/li>/g;
  return {
    rank: Number(header[1]),
    petLevel: Number(header[2]),
    trainingPointCost: Number(header[3]),
    description: descriptionMatch ? stripHtml(descriptionMatch[1]) : '',
    teachers: [...rankHtml.matchAll(teacherPattern)].map(parsePetAbilityTeacher),
  };
}

// Petopia agrupa por habilidad: una cabecera, la lista de familias y un <li> por rango con las bestias que lo enseñan
async function buildPetAbilities() {
  const html = await fetchText(PET_ABILITIES_URL);
  const abilityListHtml = html.slice(html.indexOf('Ability List'));
  const abilities = abilityListHtml
    .split("<h3 class='guide_heading")
    .slice(1)
    .map((sectionHtml) => {
      const familiesText = stripHtml(sectionHtml.match(/ability_family_list classic[^>]*>([\s\S]*?)<\/span><\/p>/)?.[1] ?? '');
      const ranks = sectionHtml.split("<li id='").slice(1).map(parsePetAbilityRank).filter(Boolean);
      return {
        name: stripHtml(sectionHtml.match(/<\/?img[^>]*>([^<]+)<\/h3>/)?.[1] ?? ''),
        icon: sectionHtml.match(/\/images\/icons\/([a-z0-9_]+)\.png/)?.[1] ?? null,
        description: stripHtml(sectionHtml.match(/abilitymaindesc[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? ''),
        families:
          familiesText === 'All Families'
            ? ['*']
            : familiesText.split(', ').map((plural) => PLURAL_FAMILY_NAMES[plural] ?? plural.replace(/s$/, '')),
        isFromTrainer: sectionHtml.includes('Can be learned from trainers'),
        ranks,
      };
    })
    .filter((ability) => ability.name && ability.ranks.length);
  return { source: 'wow-petopia.com (habilidades de mascota de Forever)', abilities };
}

async function writeDataFile(fileName, data) {
  await writeFile(new URL(fileName, OUTPUT_DIR), JSON.stringify(data));
  console.log(`${fileName}: ${(JSON.stringify(data).length / 1024).toFixed(0)} KB`);
}

await mkdir(OUTPUT_DIR, { recursive: true });
const [items, talents, abilities, pets, petAbilities] = await Promise.all([
  buildItems(),
  buildTalents(),
  buildAbilities(),
  buildPets(),
  buildPetAbilities(),
]);
await writeDataFile('items.json', items);
await writeDataFile('talents.json', talents);
await writeDataFile('abilities.json', abilities);
await writeDataFile('pets.json', pets);
await writeDataFile('pet-abilities.json', petAbilities);
await writeDataFile('meta.json', {
  generatedAt: new Date().toISOString(),
  betaLevelCap: BETA_LEVEL_CAP,
  itemsBuild: items.build,
  itemsBuildDate: items.buildDate,
  talentsVersion: talents.version,
  itemCount: items.items.length,
  beastCount: pets.beasts.length,
});
console.log(
  `Objetos: ${items.items.length} (build ${items.build}) · Hechizos: ${abilities.abilities.length} · ` +
    `Bestias: ${pets.beasts.length} · Habilidades de mascota: ${petAbilities.abilities.length}`,
);
