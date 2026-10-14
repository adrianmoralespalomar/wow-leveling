import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TalentCell } from '../../models/talent-cell.interface';
import { TalentTree } from '../../models/talent-tree.interface';
import { toTalentTooltip } from '../../utils/tooltip-content.utils';
import { GameIconComponent } from '../game-icon/game-icon.component';
import { TooltipDirective } from '../tooltip/tooltip.directive';

/** Árbol de talentos en rejilla de 4 columnas, como en el juego. */
@Component({
  selector: 'app-talent-tree',
  imports: [GameIconComponent, TooltipDirective],
  templateUrl: './talent-tree.component.html',
  styleUrl: './talent-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TalentTreeComponent {
  readonly tree = input.required<TalentTree>();
  readonly ranks = input.required<Record<string, number>>();
  /** Nivel en que la build pone el primer punto de cada talento. */
  readonly learnLevels = input.required<Map<string, number>>();
  readonly currentTalentId = input<string | null>(null);

  protected readonly spentPoints = computed(() =>
    this.tree().talents.reduce((total, talent) => total + (this.ranks()[talent.id] ?? 0), 0),
  );

  protected readonly cells = computed<TalentCell[]>(() =>
    this.tree().talents.map((talent) => {
      const rank = this.ranks()[talent.id] ?? 0;
      const learnLevel = this.learnLevels().get(talent.id);
      const footer = learnLevel ? `En esta build: primer punto al nivel ${learnLevel}` : 'No está en esta build';
      return {
        talent,
        rank,
        isCurrent: talent.id === this.currentTalentId(),
        isInBuild: learnLevel !== undefined,
        tooltip: toTalentTooltip(talent, rank, footer),
      };
    }),
  );
}
