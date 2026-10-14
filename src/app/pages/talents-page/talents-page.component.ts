import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { GameIconComponent } from '../../components/game-icon/game-icon.component';
import { TalentTreeComponent } from '../../components/talent-tree/talent-tree.component';
import { TooltipDirective } from '../../components/tooltip/tooltip.directive';
import { FIRST_TALENT_LEVEL } from '../../models/level-limits.const';
import { TalentStep } from '../../models/talent-step.interface';
import { GameDataService } from '../../services/game-data.service';
import { GuideService } from '../../services/guide.service';
import { PlayerProgressService } from '../../services/player-progress.service';
import { getTalentIdForLevel, getTalentRanksAtLevel } from '../../utils/talent-build.utils';

@Component({
  selector: 'app-talents-page',
  imports: [GameIconComponent, TalentTreeComponent, TooltipDirective],
  templateUrl: './talents-page.component.html',
  styleUrl: './talents-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TalentsPageComponent {
  protected readonly gameData = inject(GameDataService);
  private readonly guideService = inject(GuideService);
  protected readonly playerProgress = inject(PlayerProgressService);

  protected readonly level = this.playerProgress.level;
  protected readonly build = this.playerProgress.talentBuild;

  protected readonly ranks = computed(() => {
    const build = this.build();
    return build ? getTalentRanksAtLevel(build, this.level()) : {};
  });

  protected readonly learnLevels = computed(() => {
    const learnLevels = new Map<string, number>();
    this.build()?.points.forEach((talentId, index) => {
      if (!learnLevels.has(talentId)) learnLevels.set(talentId, index + FIRST_TALENT_LEVEL);
    });
    return learnLevels;
  });

  protected readonly currentTalentId = computed(() => {
    const build = this.build();
    return build ? getTalentIdForLevel(build, this.level()) : null;
  });

  protected readonly steps = computed<TalentStep[]>(() =>
    (this.build()?.points ?? [])
      .map((_, index) => this.guideService.getTalentStep(index + FIRST_TALENT_LEVEL))
      .filter((step): step is TalentStep => step !== null),
  );

  protected onBuildSelected(buildId: string): void {
    this.playerProgress.setTalentBuildId(buildId);
  }

  protected onStepClicked(level: number): void {
    this.playerProgress.setLevel(level);
  }
}
