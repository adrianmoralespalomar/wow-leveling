import { computed, inject, Injectable } from '@angular/core';
import { Ability } from '../models/ability.interface';
import { Talent } from '../models/talent.interface';
import { getTalentLearnLevel } from '../utils/talent-build.utils';
import { GameDataService } from './game-data.service';
import { PlayerProgressService } from './player-progress.service';

/** Qué hechizos enseña el instructor en cada nivel según la build elegida. */
@Injectable({ providedIn: 'root' })
export class TrainingService {
  private readonly gameData = inject(GameDataService);
  private readonly playerProgress = inject(PlayerProgressService);

  private readonly activeTalentsByName = computed(
    () =>
      new Map<string, Talent>(
        this.gameData
          .talentTrees()
          .flatMap((tree) => tree.talents)
          .filter((talent) => !talent.passive)
          .map((talent) => [talent.name, talent]),
      ),
  );

  private readonly trainableAbilities = computed(() =>
    this.gameData.abilities().filter((ability) => ability.school !== 'pets' && this.isTrainableWithBuild(ability)),
  );

  readonly trainingLevels = computed(() => [...new Set(this.trainableAbilities().map((ability) => ability.level))]);

  getAbilitiesForLevel(level: number): Ability[] {
    return this.trainableAbilities().filter((ability) => ability.level === level);
  }

  getNextTrainingLevel(level: number): number | null {
    return this.trainingLevels().find((trainingLevel) => trainingLevel > level) ?? null;
  }

  // El rango 1 de un hechizo de talento llega con el propio talento; los siguientes solo si la build lo tiene
  private isTrainableWithBuild(ability: Ability): boolean {
    const talent = this.activeTalentsByName().get(ability.name);
    if (!talent) return true;
    const build = this.playerProgress.talentBuild();
    const learnLevel = build ? getTalentLearnLevel(build, talent.id) : null;
    return ability.rank > 1 && learnLevel !== null && learnLevel <= ability.level;
  }
}
