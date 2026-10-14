import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BeastView } from '../../models/beast-view.interface';
import { GameIconComponent } from '../game-icon/game-icon.component';
import { TooltipDirective } from '../tooltip/tooltip.directive';

const FALLBACK_BEAST_ICON = 'ability_hunter_beasttaming';

/** Bestia domable: icono de su familia, nombre, nivel y zona; enlaza al mapa. */
@Component({
  selector: 'app-beast-link',
  imports: [GameIconComponent, TooltipDirective],
  templateUrl: './beast-link.component.html',
  styleUrl: './beast-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.icon-only]': '!showName()' },
})
export class BeastLinkComponent {
  readonly view = input.required<BeastView>();
  readonly showName = input(true);
  readonly iconSize = input<'small' | 'medium' | 'large'>('medium');

  protected readonly icon = computed(() => this.view().family?.icon ?? FALLBACK_BEAST_ICON);
  protected readonly detail = computed(() => {
    const { beast, family, levelText } = this.view();
    return `${family?.name ?? 'Bestia'}, ${levelText}, ${beast.zones.join(' / ')}`;
  });
}
