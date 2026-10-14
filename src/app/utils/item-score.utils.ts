import {
  AXE_SUBCLASSES,
  ITEM_STAT_WEIGHTS,
  MELEE_DPS_WEIGHT,
  ORC_AXE_BONUS,
  QUIVER_SPEED_WEIGHT,
  RANGED_DPS_WEIGHT,
} from '../models/item-score-weights.const';
import { Item } from '../models/item.interface';

const WEAPON_CLASS = 2;
const ARMOR_CLASS = 4;
const MAIL_SUBCLASS = 3;
const MAIL_PROFICIENCY_LEVEL = 40;

/** Nivel a partir del cual se puede llevar: el requerido, el de la misión o, si no hay, el nivel de objeto menos 5. */
export function getItemMinLevel(item: Item): number {
  if (item.requiredLevel > 1) return item.requiredLevel;
  if (item.source?.level) return item.source.level;
  return Math.max(1, item.itemLevel - 5);
}

export function scoreItem(item: Item): number {
  const statsScore = Object.entries(item.stats).reduce(
    (total, [statKey, value]) => total + (ITEM_STAT_WEIGHTS[statKey] ?? 0) * value,
    0,
  );
  if (item.slot === 'Ranged') return statsScore + (item.dps ?? 0) * RANGED_DPS_WEIGHT;
  if (item.slot === 'Bag') return (item.quiverSpeed ?? 0) * QUIVER_SPEED_WEIGHT + item.itemLevel / 10;
  if (item.slot === 'Ammo') return item.requiredLevel + item.quality;
  if (item.itemClass !== WEAPON_CLASS) return statsScore;
  const axeBonus = AXE_SUBCLASSES.includes(item.itemSubclass) ? ORC_AXE_BONUS : 0;
  return statsScore + (item.dps ?? 0) * MELEE_DPS_WEIGHT + axeBonus;
}

export function canWearAtLevel(item: Item, level: number): boolean {
  const isMail = item.itemClass === ARMOR_CLASS && item.itemSubclass === MAIL_SUBCLASS;
  return getItemMinLevel(item) <= level && (!isMail || level >= MAIL_PROFICIENCY_LEVEL);
}

export function isAxe(item: Item): boolean {
  return item.itemClass === WEAPON_CLASS && AXE_SUBCLASSES.includes(item.itemSubclass);
}
