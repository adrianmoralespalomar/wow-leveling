import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ITEM_PAGE_URL_TEMPLATE } from '../../models/item-page-url.const';
import { Item } from '../../models/item.interface';
import { TooltipContent } from '../../models/tooltip-content.type';
import { GameIconComponent } from '../game-icon/game-icon.component';
import { TooltipDirective } from '../tooltip/tooltip.directive';

@Component({
  selector: 'app-item-link',
  imports: [GameIconComponent, TooltipDirective],
  templateUrl: './item-link.component.html',
  styleUrl: './item-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.icon-only]': '!showName()' },
})
export class ItemLinkComponent {
  readonly item = input.required<Item | null | undefined>();
  readonly showName = input(true);
  readonly iconSize = input<'small' | 'medium' | 'large'>('medium');
  /** Detalle bajo el nombre (procedencia, DPS...). */
  readonly detail = input<string | null>(null);

  protected readonly tooltipContent = computed<TooltipContent | null>(() => {
    const item = this.item();
    return item ? { kind: 'item', item } : null;
  });

  protected readonly itemPageUrl = computed(() => {
    const item = this.item();
    return item ? ITEM_PAGE_URL_TEMPLATE.replace('{id}', String(item.id)) : null;
  });
}
