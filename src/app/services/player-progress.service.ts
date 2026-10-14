import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { DEFAULT_PET_FAMILY_NAME } from '../models/all-pet-families.const';
import { MAX_LEVEL, MIN_LEVEL } from '../models/level-limits.const';
import { STORAGE_KEYS } from '../models/storage-keys.const';
import { TalentBuild } from '../models/talent-build.interface';
import { readStoredValue, writeStoredValue } from '../utils/local-storage.utils';
import { GameDataService } from './game-data.service';

const DEFAULT_TALENT_BUILD_ID = 'mm-leveling';

/** Nivel actual y preferencias del jugador; se guardan en el navegador. */
@Injectable({ providedIn: 'root' })
export class PlayerProgressService {
  private readonly gameData = inject(GameDataService);

  readonly level = signal<number>(readStoredValue(STORAGE_KEYS.LEVEL, MIN_LEVEL));
  readonly talentBuildId = signal<string>(readStoredValue(STORAGE_KEYS.TALENT_BUILD_ID, DEFAULT_TALENT_BUILD_ID));
  readonly includeRandomDrops = signal<boolean>(readStoredValue(STORAGE_KEYS.INCLUDE_RANDOM_DROPS, false));
  /** Familia de tu mascota (en inglés) para calcular qué habilidades puede aprender. */
  readonly petFamilyName = signal<string>(readStoredValue(STORAGE_KEYS.PET_FAMILY_NAME, DEFAULT_PET_FAMILY_NAME));

  readonly talentBuild = computed<TalentBuild | null>(() => {
    const builds = this.gameData.talentBuilds();
    return builds.find((build) => build.id === this.talentBuildId()) ?? builds[0] ?? null;
  });

  constructor() {
    effect(() => writeStoredValue(STORAGE_KEYS.LEVEL, this.level()));
    effect(() => writeStoredValue(STORAGE_KEYS.TALENT_BUILD_ID, this.talentBuildId()));
    effect(() => writeStoredValue(STORAGE_KEYS.INCLUDE_RANDOM_DROPS, this.includeRandomDrops()));
    effect(() => writeStoredValue(STORAGE_KEYS.PET_FAMILY_NAME, this.petFamilyName()));
  }

  setLevel(level: number): void {
    this.level.set(Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.round(level))));
  }
}
