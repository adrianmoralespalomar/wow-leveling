// URLs de las fuentes de datos y utilidades de descarga compartidas por build-data y data-server.
export const USER_AGENT = 'Mozilla/5.0 (wow-leveling data build)';
export const ITEMS_BASE_URL = 'https://foreverchanges.pro/items';
export const QUESTS_URL = 'https://foreverchanges.pro/quests/list.json';
export const TALENTS_URL = 'https://wowforevertalent.com/hunter/';
export const ABILITIES_URL = 'https://wowforevertalent.com/abilities/hunter/';
export const PETS_URL = 'https://wowforevertools.com/hunter-pets';
export const PET_ABILITIES_URL = 'https://www.wow-petopia.com/forever/abilities.php';

export async function fetchText(url) {
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) throw new Error(`${url} -> HTTP ${response.status}`);
  return response.text();
}

export async function fetchJson(url) {
  return JSON.parse(await fetchText(url));
}

export function decodeHtmlEntities(text) {
  return text
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&#039;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&amp;', '&');
}

// Astro serializa las props como [tipo, valor]: 0 = objeto/valor, 1 = array
export function decodeAstroValue(value) {
  if (!Array.isArray(value)) return value;
  const [type, content] = value;
  if (type === 1) return content.map(decodeAstroValue);
  if (type !== 0 || typeof content !== 'object' || content === null) return content;
  return Object.fromEntries(Object.entries(content).map(([key, inner]) => [key, decodeAstroValue(inner)]));
}

export function readTalentsProps(html) {
  const propsMatch = html.match(/<astro-island[^>]*props="([^"]*)"/);
  if (!propsMatch) throw new Error('No se encontraron los datos de talentos');
  return JSON.parse(decodeHtmlEntities(propsMatch[1]));
}

/** Versiones publicadas ahora mismo en las fuentes, para saber si merece la pena regenerar. */
export async function fetchRemoteVersions() {
  const [newItems, talentsHtml] = await Promise.all([fetchJson(`${ITEMS_BASE_URL}/new.json`), fetchText(TALENTS_URL)]);
  return {
    itemsBuild: newItems.forever_build,
    itemsBuildDate: newItems.forever_build_date,
    talentsVersion: decodeAstroValue(readTalentsProps(talentsHtml).version),
  };
}
