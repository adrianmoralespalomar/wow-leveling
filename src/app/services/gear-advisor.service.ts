import { computed, inject, Injectable } from '@angular/core';
import { AcquisitionRoute } from '../models/acquisition-route.type';
import { EASY_ACQUISITION_ROUTES } from '../models/easy-acquisition-routes.const';
import { MAX_RECOMMENDED_ITEM_LEVEL, RAID_PLACES } from '../models/endgame-limits.const';
import { GearRouteOption } from '../models/gear-route-option.interface';
import { GearSlotKey } from '../models/gear-slot-key.type';
import { GEAR_SLOTS } from '../models/gear-slots.const';
import { Item } from '../models/item.interface';
import { ScoredItem } from '../models/scored-item.interface';
import { getAcquisitionRoute } from '../utils/acquisition-route.utils';
import { canWearAtLevel, getItemMinLevel, scoreItem } from '../utils/item-score.utils';
import { GameDataService } from './game-data.service';
import { PlayerProgressService } from './player-progress.service';

const DEFAULT_RECOMMENDATION_LIMIT = 3;
const UPGRADE_LOOKAHEAD_LEVELS = 5;
const ROUTE_ALTERNATIVES_LIMIT = 3;
/** Una alternativa por otra vía solo se enseña si se acerca a la mejor pieza. */
const MIN_ALTERNATIVE_SCORE_RATIO = 0.7;
/** Si una mejora fácil llega en estos niveles o menos, conviene esperarla. */
const WAIT_LOOKAHEAD_LEVELS = 3;

/** Elige el mejor equipo para cada ranura según el nivel y el modo, con los pesos de item-score-weights.const. */
@Injectable({ providedIn: 'root' })
export class GearAdvisorService {
  private readonly gameData = inject(GameDataService);
  private readonly playerProgress = inject(PlayerProgressService);

  private readonly gearSlotKeyByItemSlot = new Map<string, GearSlotKey>(
    GEAR_SLOTS.flatMap((gearSlot) => gearSlot.itemSlots.map((itemSlot) => [itemSlot, gearSlot.key])),
  );

  private readonly scoredItemsBySlot = computed(() => {
    const scoredItemsBySlot = new Map<GearSlotKey, ScoredItem[]>(GEAR_SLOTS.map((gearSlot) => [gearSlot.key, []]));
    for (const item of this.gameData.items()) {
      const gearSlotKey = this.gearSlotKeyByItemSlot.get(item.slot);
      if (gearSlotKey) scoredItemsBySlot.get(gearSlotKey)?.push(this.toScoredItem(item));
    }
    for (const scoredItems of scoredItemsBySlot.values()) scoredItems.sort((first, second) => second.score - first.score);
    return scoredItemsBySlot;
  });

  getGearSlotKey(item: Item): GearSlotKey | null {
    return this.gearSlotKeyByItemSlot.get(item.slot) ?? null;
  }

  toScoredItem(item: Item): ScoredItem {
    return { item, score: scoreItem(item, this.playerProgress.gameMode()), minLevel: getItemMinLevel(item) };
  }

  getSlotItems(gearSlotKey: GearSlotKey): ScoredItem[] {
    return this.scoredItemsBySlot().get(gearSlotKey) ?? [];
  }

  getRecommendations(gearSlotKey: GearSlotKey, level: number, limit = DEFAULT_RECOMMENDATION_LIMIT): ScoredItem[] {
    return this.getSlotItems(gearSlotKey)
      .filter(({ item }) => this.isRecommendable(item) && canWearAtLevel(item, level))
      .slice(0, limit);
  }

  /** La mejor pieza de cada vía distinta a la de la mejor: misión, subasta, mazmorra, campo de batalla... */
  getRouteAlternatives(gearSlotKey: GearSlotKey, level: number): GearRouteOption[] {
    const best = this.getRecommendations(gearSlotKey, level, 1)[0];
    if (!best) return [];
    const bestRoute = getAcquisitionRoute(best.item);
    const optionsByRoute = new Map<AcquisitionRoute, ScoredItem>();
    for (const scoredItem of this.getSlotItems(gearSlotKey)) {
      if (scoredItem.score < best.score * MIN_ALTERNATIVE_SCORE_RATIO) break;
      const route = getAcquisitionRoute(scoredItem.item);
      if (route === bestRoute || route === 'other' || optionsByRoute.has(route)) continue;
      if (this.isObtainableByHorde(scoredItem.item) && canWearAtLevel(scoredItem.item, level)) optionsByRoute.set(route, scoredItem);
    }
    return [...optionsByRoute]
      .map(([route, scoredItem]) => ({ route, scoredItem }))
      .slice(0, ROUTE_ALTERNATIVES_LIMIT);
  }

  /** Mejora fácil (misión o vendedor) que llega en pocos niveles y vale tanto como la mejor pieza de ahora. */
  getWaitAdvice(gearSlotKey: GearSlotKey, level: number): GearRouteOption | null {
    const best = this.getRecommendations(gearSlotKey, level, 1)[0];
    if (!best || EASY_ACQUISITION_ROUTES.includes(getAcquisitionRoute(best.item))) return null;
    const easyUpgrade = this.getSlotItems(gearSlotKey)
      .filter(
        (scoredItem) =>
          scoredItem.score >= best.score &&
          scoredItem.minLevel > level &&
          scoredItem.minLevel <= level + WAIT_LOOKAHEAD_LEVELS &&
          EASY_ACQUISITION_ROUTES.includes(getAcquisitionRoute(scoredItem.item)) &&
          this.isObtainableByHorde(scoredItem.item) &&
          canWearAtLevel(scoredItem.item, scoredItem.minLevel),
      )
      .sort((first, second) => first.minLevel - second.minLevel || second.score - first.score)[0];
    return easyUpgrade ? { route: getAcquisitionRoute(easyUpgrade.item), scoredItem: easyUpgrade } : null;
  }

  getUpcomingUpgrades(gearSlotKey: GearSlotKey, level: number, limit = 2): ScoredItem[] {
    const bestScore = this.getRecommendations(gearSlotKey, level, 1)[0]?.score ?? 0;
    return this.getSlotItems(gearSlotKey)
      .filter(
        (scoredItem) =>
          this.isRecommendable(scoredItem.item) &&
          scoredItem.score > bestScore &&
          scoredItem.minLevel > level &&
          canWearAtLevel(scoredItem.item, level + UPGRADE_LOOKAHEAD_LEVELS),
      )
      .sort((first, second) => first.minLevel - second.minLevel || second.score - first.score)
      .slice(0, limit);
  }

  getDungeonLoot(lootPlace: string, limit: number): ScoredItem[] {
    return [...this.scoredItemsBySlot().values()]
      .flat()
      .filter(({ item }) => item.source?.kind === 'dungeon' && item.source.place === lootPlace && item.slot !== 'Ammo')
      .sort((first, second) => second.score - first.score)
      .slice(0, limit);
  }

  isRecommendable(item: Item): boolean {
    return this.isObtainableByHorde(item) && (this.playerProgress.includeRandomDrops() || item.source?.kind !== 'world');
  }

  private isObtainableByHorde(item: Item): boolean {
    if (!item.source || item.source.faction === 'alliance') return false;
    return item.itemLevel <= MAX_RECOMMENDED_ITEM_LEVEL && !RAID_PLACES.includes(item.source.place);
  }
}
