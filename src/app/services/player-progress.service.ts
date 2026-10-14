import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { DEFAULT_PET_FAMILY_NAME } from '../models/all-pet-families.const';
import { GameMode } from '../models/game-mode.type';
import { MAX_LEVEL, MIN_LEVEL } from '../models/level-limits.const';
import { STORAGE_KEYS } from '../models/storage-keys.const';
import { TalentBuild } from '../models/talent-build.interface';
import { readStoredValue, writeStoredValue } from '../utils/local-storage.utils';
import { GameDataService } from './game-data.service';

const DEFAULT_GAME_MODE: GameMode = 'pve';
const DEFAULT_PVE_TALENT_BUILD_ID = 'mm-leveling';
const DEFAULT_PVP_TALENT_BUILD_ID = 'mm-pvp';

/** Nivel actual y preferencias del jugador; se guardan en el navegador. */
@Injectable({ providedIn: 'root' })
export class PlayerProgressService {
  private readonly gameData = inject(GameDataService);

  readonly level = signal<number>(readStoredValue(STORAGE_KEYS.LEVEL, MIN_LEVEL));
  readonly gameMode = signal<GameMode>(readStoredValue(STORAGE_KEYS.GAME_MODE, DEFAULT_GAME_MODE));
  /** Build elegida en cada modo: al cambiar de modo vuelves a la que tenías en él. */
  private readonly talentBuildIds = signal<Record<GameMode, string>>({
    pve: readStoredValue(STORAGE_KEYS.TALENT_BUILD_ID, DEFAULT_PVE_TALENT_BUILD_ID),
    pvp: readStoredValue(STORAGE_KEYS.PVP_TALENT_BUILD_ID, DEFAULT_PVP_TALENT_BUILD_ID),
  });
  readonly includeRandomDrops = signal<boolean>(readStoredValue(STORAGE_KEYS.INCLUDE_RANDOM_DROPS, false));
  /** Familia de tu mascota (en inglés) para calcular qué habilidades puede aprender. */
  readonly petFamilyName = signal<string>(readStoredValue(STORAGE_KEYS.PET_FAMILY_NAME, DEFAULT_PET_FAMILY_NAME));

  readonly talentBuildsForMode = computed<TalentBuild[]>(() =>
    this.gameData.talentBuilds().filter((build) => build.mode === this.gameMode()),
  );
  readonly talentBuild = computed<TalentBuild | null>(() => {
    const builds = this.talentBuildsForMode();
    return builds.find((build) => build.id === this.talentBuildIds()[this.gameMode()]) ?? builds[0] ?? null;
  });

  constructor() {
    effect(() => writeStoredValue(STORAGE_KEYS.LEVEL, this.level()));
    effect(() => writeStoredValue(STORAGE_KEYS.GAME_MODE, this.gameMode()));
    effect(() => writeStoredValue(STORAGE_KEYS.TALENT_BUILD_ID, this.talentBuildIds().pve));
    effect(() => writeStoredValue(STORAGE_KEYS.PVP_TALENT_BUILD_ID, this.talentBuildIds().pvp));
    effect(() => writeStoredValue(STORAGE_KEYS.INCLUDE_RANDOM_DROPS, this.includeRandomDrops()));
    effect(() => writeStoredValue(STORAGE_KEYS.PET_FAMILY_NAME, this.petFamilyName()));
  }

  setLevel(level: number): void {
    this.level.set(Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.round(level))));
  }

  setTalentBuildId(buildId: string): void {
    this.talentBuildIds.update((buildIds) => ({ ...buildIds, [this.gameMode()]: buildId }));
  }
}
