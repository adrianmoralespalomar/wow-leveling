import { GameMode } from './game-mode.type';
import { ITEM_STAT_KEYS } from './item-stat-keys.const';

/**
 * Pesos orientativos para un cazador de Puntería subiendo de nivel (1 = un punto de Agilidad).
 * Las conversiones de índice de golpe y de crítico de Forever aún no se conocen: son una estimación.
 */
export const ITEM_STAT_WEIGHTS: Record<string, number> = {
  [ITEM_STAT_KEYS.AGILITY]: 1,
  [ITEM_STAT_KEYS.STRENGTH]: 0.05,
  [ITEM_STAT_KEYS.INTELLECT]: 0.3,
  [ITEM_STAT_KEYS.SPIRIT]: 0.05,
  [ITEM_STAT_KEYS.STAMINA]: 0.25,
  [ITEM_STAT_KEYS.HIT_RATING]: 1.2,
  [ITEM_STAT_KEYS.CRIT_RATING]: 1.2,
  [ITEM_STAT_KEYS.HASTE_RATING]: 0.8,
  [ITEM_STAT_KEYS.ATTACK_POWER]: 0.45,
  [ITEM_STAT_KEYS.RANGED_ATTACK_POWER]: 0.42,
  [ITEM_STAT_KEYS.ARMOR]: 0.005,
};
/** En campos de batalla vivir más pesa casi tanto como pegar: el Aguante sube y la armadura cuenta algo más. */
export const PVP_ITEM_STAT_WEIGHTS: Record<string, number> = {
  ...ITEM_STAT_WEIGHTS,
  [ITEM_STAT_KEYS.STAMINA]: 0.8,
  [ITEM_STAT_KEYS.INTELLECT]: 0.35,
  [ITEM_STAT_KEYS.ARMOR]: 0.01,
};
export const ITEM_STAT_WEIGHTS_BY_GAME_MODE: Record<GameMode, Record<string, number>> = {
  pve: ITEM_STAT_WEIGHTS,
  pvp: PVP_ITEM_STAT_WEIGHTS,
};
/** Cada punto de DPS del arma a distancia: casi todo el daño de tus disparos sale de ahí. */
export const RANGED_DPS_WEIGHT = 6;
export const MELEE_DPS_WEIGHT = 0.3;
export const QUIVER_SPEED_WEIGHT = 5;
/** Axe Specialization del orco: +1% de crítico con un hacha equipada. */
export const ORC_AXE_BONUS = 12;
export const AXE_SUBCLASSES = [0, 1];
