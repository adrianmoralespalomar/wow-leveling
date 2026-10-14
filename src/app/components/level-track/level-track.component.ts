import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MAX_LEVEL, MIN_LEVEL } from '../../models/level-limits.const';
import { MILESTONE_KIND_LABELS } from '../../models/milestone-kind-labels.const';
import { TrackMarker } from '../../models/track-marker.interface';
import { GameDataService } from '../../services/game-data.service';
import { PlayerProgressService } from '../../services/player-progress.service';
import { TooltipDirective } from '../tooltip/tooltip.directive';

const TICK_LEVELS = [1, 10, 20, 30, 40, 50, 60];

/** Barra de nivel 1-60 al estilo de la barra de experiencia, con los hitos de la guía marcados. */
@Component({
  selector: 'app-level-track',
  imports: [TooltipDirective],
  templateUrl: './level-track.component.html',
  styleUrl: './level-track.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelTrackComponent {
  private readonly gameData = inject(GameDataService);
  protected readonly playerProgress = inject(PlayerProgressService);

  protected readonly minLevel = MIN_LEVEL;
  protected readonly maxLevel = MAX_LEVEL;
  protected readonly ticks = TICK_LEVELS.map((level) => ({ level, position: this.toTrackPosition(level) }));

  protected readonly progress = computed(() => this.toTrackPosition(this.playerProgress.level()));

  protected readonly markers = computed<TrackMarker[]>(() =>
    (this.gameData.levelingGuide()?.milestones ?? []).map((milestone) => ({
      level: milestone.level,
      position: this.toTrackPosition(milestone.level),
      isReached: milestone.level <= this.playerProgress.level(),
      tooltip: {
        kind: 'spell',
        name: milestone.title,
        subtitle: `Nivel ${milestone.level}`,
        cost: MILESTONE_KIND_LABELS[milestone.kind],
        description: milestone.description,
        footer: 'Pulsa para saltar a este nivel',
      },
    })),
  );

  protected onPreviousLevelClicked(): void {
    this.playerProgress.setLevel(this.playerProgress.level() - 1);
  }

  protected onNextLevelClicked(): void {
    this.playerProgress.setLevel(this.playerProgress.level() + 1);
  }

  protected onMarkerClicked(level: number): void {
    this.playerProgress.setLevel(level);
  }

  protected onLevelSliderMoved(event: Event): void {
    this.playerProgress.setLevel(Number((event.target as HTMLInputElement).value));
  }

  private toTrackPosition(level: number): number {
    return (level - MIN_LEVEL) / (MAX_LEVEL - MIN_LEVEL);
  }
}
