import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { TooltipService } from '../../services/tooltip.service';
import { ItemTooltipComponent } from './item-tooltip.component';
import { SpellTooltipComponent } from './spell-tooltip.component';

const CURSOR_OFFSET = 16;
const VIEWPORT_MARGIN = 8;

@Component({
  selector: 'app-tooltip-host',
  imports: [ItemTooltipComponent, SpellTooltipComponent],
  templateUrl: './tooltip-host.component.html',
  styleUrl: './tooltip-host.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'tooltipService.hide()',
    '(document:keydown.escape)': 'tooltipService.hide()',
    '(window:scroll)': 'tooltipService.hide()',
  },
})
export class TooltipHostComponent {
  private readonly document = inject(DOCUMENT);
  protected readonly tooltipService = inject(TooltipService);

  private readonly tooltipBox = viewChild<ElementRef<HTMLElement>>('tooltipBox');

  constructor() {
    // Coloca el tooltip junto al cursor sin que se salga de la pantalla
    afterRenderEffect(() => {
      const box = this.tooltipBox()?.nativeElement;
      const { x, y } = this.tooltipService.anchor();
      if (!box) return;
      const viewportWidth = this.document.documentElement.clientWidth;
      const viewportHeight = this.document.documentElement.clientHeight;
      const fitsRight = x + CURSOR_OFFSET + box.offsetWidth < viewportWidth - VIEWPORT_MARGIN;
      const fitsBelow = y + CURSOR_OFFSET + box.offsetHeight < viewportHeight - VIEWPORT_MARGIN;
      const left = fitsRight ? x + CURSOR_OFFSET : x - CURSOR_OFFSET - box.offsetWidth;
      const top = fitsBelow ? y + CURSOR_OFFSET : y - CURSOR_OFFSET - box.offsetHeight;
      box.style.left = `${Math.max(VIEWPORT_MARGIN, left)}px`;
      box.style.top = `${Math.max(VIEWPORT_MARGIN, top)}px`;
    });
  }
}
