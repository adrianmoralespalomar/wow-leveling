import { computed, inject, Injectable } from '@angular/core';
import { Battleground } from '../models/battleground.interface';
import { PetFamily } from '../models/pet-family.interface';
import { PvpBracket } from '../models/pvp-bracket.interface';
import { PvpBracketView } from '../models/pvp-bracket-view.interface';
import { PvpPetPickView } from '../models/pvp-pet-pick-view.interface';
import { GameDataService } from './game-data.service';

/** Cruza la guía de campos de batalla curada con los objetos y las mascotas de la beta. */
@Injectable({ providedIn: 'root' })
export class PvpGuideService {
  private readonly gameData = inject(GameDataService);

  readonly guide = this.gameData.pvpGuide;
  readonly brackets = computed(() => (this.guide()?.brackets ?? []).map((bracket) => this.toBracketView(bracket)));
  readonly petPicks = computed<PvpPetPickView[]>(() => {
    const familiesById = new Map<number, PetFamily>(this.gameData.petFamilies().map((family) => [family.id, family]));
    const familyGuides = this.gameData.petGuide()?.families ?? [];
    return (this.guide()?.pets ?? []).map((pick) => ({
      pick,
      family: familiesById.get(pick.familyId),
      ability: familyGuides.find((familyGuide) => familyGuide.id === pick.familyId)?.ability ?? null,
    }));
  });

  getBracket(level: number): PvpBracketView | null {
    return this.brackets().find(({ bracket }) => bracket.minLevel <= level && level <= bracket.maxLevel) ?? null;
  }

  getBattlegroundsForLevel(level: number): Battleground[] {
    return (this.guide()?.battlegrounds ?? []).filter(
      (battleground) => battleground.minLevel <= level && level <= battleground.maxLevel,
    );
  }

  private toBracketView(bracket: PvpBracket): PvpBracketView {
    const itemsById = this.gameData.itemsById();
    return { bracket, items: bracket.itemIds.map((itemId) => itemsById.get(itemId)) };
  }
}
