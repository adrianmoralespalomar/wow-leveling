import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { GearSlotKey } from '../models/gear-slot-key.type';
import { ScoredItem } from '../models/scored-item.interface';
import { STORAGE_KEYS } from '../models/storage-keys.const';
import { parseCharacterExport } from '../utils/character-export.utils';
import { readStoredValue, writeStoredValue } from '../utils/local-storage.utils';
import { GameDataService } from './game-data.service';
import { GearAdvisorService } from './gear-advisor.service';

/** Personaje importado con el addon WowLevelingExport. */
@Injectable({ providedIn: 'root' })
export class CharacterService {
  private readonly gameData = inject(GameDataService);
  private readonly gearAdvisor = inject(GearAdvisorService);

  readonly rawExport = signal<string>(readStoredValue(STORAGE_KEYS.CHARACTER_EXPORT, ''));

  private readonly parseResult = computed(() => (this.rawExport() ? parseCharacterExport(this.rawExport()) : null));

  readonly character = computed(() => this.parseResult()?.character ?? null);
  readonly parseError = computed(() => this.parseResult()?.error ?? null);

  /** Objetos equipados que existen en los datos, agrupados por ranura de recomendación. */
  readonly equippedItemsBySlot = computed(() => {
    const equippedItemsBySlot = new Map<GearSlotKey, ScoredItem[]>();
    for (const equippedItem of this.character()?.equipment ?? []) {
      const item = this.gameData.itemsById().get(equippedItem.itemId);
      const gearSlotKey = item ? this.gearAdvisor.getGearSlotKey(item) : null;
      if (!item || !gearSlotKey) continue;
      equippedItemsBySlot.set(gearSlotKey, [
        ...(equippedItemsBySlot.get(gearSlotKey) ?? []),
        this.gearAdvisor.toScoredItem(item),
      ]);
    }
    return equippedItemsBySlot;
  });

  constructor() {
    effect(() => writeStoredValue(STORAGE_KEYS.CHARACTER_EXPORT, this.rawExport()));
  }
}
