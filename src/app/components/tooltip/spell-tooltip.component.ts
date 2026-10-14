import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SpellTooltipContent } from '../../models/spell-tooltip-content.interface';

@Component({
  selector: 'app-spell-tooltip',
  templateUrl: './spell-tooltip.component.html',
  styleUrl: './spell-tooltip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpellTooltipComponent {
  readonly content = input.required<SpellTooltipContent>();
}
