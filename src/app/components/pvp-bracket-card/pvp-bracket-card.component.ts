import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PvpBracketView } from '../../models/pvp-bracket-view.interface';
import { describeItemBriefly } from '../../utils/item-description.utils';
import { ItemLinkComponent } from '../item-link/item-link.component';

/** Un tramo de campos de batalla: qué campos hay, cómo jugarlo y qué equipo llevar. */
@Component({
  selector: 'app-pvp-bracket-card',
  imports: [ItemLinkComponent],
  templateUrl: './pvp-bracket-card.component.html',
  styleUrl: './pvp-bracket-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.current]': 'isCurrent()' },
})
export class PvpBracketCardComponent {
  readonly view = input.required<PvpBracketView>();
  /** El tramo en el que está el jugador. */
  readonly isCurrent = input(false);

  protected readonly describeItemBriefly = describeItemBriefly;
}
