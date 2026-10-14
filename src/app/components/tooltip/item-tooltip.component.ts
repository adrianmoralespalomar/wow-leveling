import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ITEM_SOURCE_KIND_LABELS } from '../../models/item-source-kind-labels.const';
import { Item } from '../../models/item.interface';
import { TooltipLine } from '../../models/tooltip-line.interface';

// Las líneas de efecto se pintan en verde, como en el juego
const EFFECT_LINE_PATTERN = /^(Equip|Use|Chance on hit|Set)/;

@Component({
  selector: 'app-item-tooltip',
  templateUrl: './item-tooltip.component.html',
  styleUrl: './item-tooltip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemTooltipComponent {
  readonly item = input.required<Item>();

  protected readonly lines = computed<TooltipLine[]>(() =>
    this.item().tooltip.map((line) => {
      const [left, right] = line.split('\t');
      return { left, right: right ?? null, isEffect: EFFECT_LINE_PATTERN.test(left) };
    }),
  );

  protected readonly sourceText = computed(() => {
    const source = this.item().source;
    if (!source) return 'Procedencia desconocida en la beta';
    const parts = [ITEM_SOURCE_KIND_LABELS[source.kind], source.label, source.place].filter(
      (part, index, allParts) => part && allParts.indexOf(part) === index,
    );
    return parts.join(', ');
  });
}
