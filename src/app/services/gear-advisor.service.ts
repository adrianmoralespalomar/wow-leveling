import { computed, inject, Injectable } from '@angular/core';
import { MAX_RECOMMENDED_ITEM_LEVEL, RAID_PLACES } from '../models/endgame-limits.const';
import { GearSlotKey } from '../models/gear-slot-key.type';
import { GEAR_SLOTS } from '../models/gear-slots.const';
import { Item } from '../models/item.interface';
import { ScoredItem } from '../models/scored-item.interface';
import { canWearAtLevel, getItemMinLevel, scoreItem } from '../utils/item-score.utils';
import { GameDataService } from './game-data.service';
import { PlayerProgressService } from './player-progress.service';

const DEFAULT_RECOMMENDATION_LIMIT = 3;
const UPGRADE_LOOKAHEAD_LEVELS = 5;

/** Elige el mejor equipo para cada ranura según el nivel, con los pesos de item-score-weights.const. */
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
    return { item, score: scoreItem(item), minLevel: getItemMinLevel(item) };
  }

  getSlotItems(gearSlotKey: GearSlotKey): ScoredItem[] {
    return this.scoredItemsBySlot().get(gearSlotKey) ?? [];
  }

  getRecommendations(gearSlotKey: GearSlotKey, level: number, limit = DEFAULT_RECOMMENDATION_LIMIT): ScoredItem[] {
    return this.getSlotItems(gearSlotKey)
      .filter(({ item }) => this.isRecommendable(item) && canWearAtLevel(item, level))
      .slice(0, limit);
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
    if (!item.source || item.source.faction === 'alliance') return false;
    if (item.itemLevel > MAX_RECOMMENDED_ITEM_LEVEL || RAID_PLACES.includes(item.source.place)) return false;
    return this.playerProgress.includeRandomDrops() || item.source.kind !== 'world';
  }
}
