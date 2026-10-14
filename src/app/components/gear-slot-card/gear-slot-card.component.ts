import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { GearSlot } from '../../models/gear-slot.interface';
import { ScoredItem } from '../../models/scored-item.interface';
import { GearAdvisorService } from '../../services/gear-advisor.service';
import { describeItemBriefly } from '../../utils/item-description.utils';
import { ItemLinkComponent } from '../item-link/item-link.component';

const MIN_UPGRADE_SCORE_GAIN = 0.5;

/** Mejor objeto para una ranura a tu nivel, alternativas y la próxima mejora. */
@Component({
  selector: 'app-gear-slot-card',
  imports: [ItemLinkComponent],
  templateUrl: './gear-slot-card.component.html',
  styleUrl: './gear-slot-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GearSlotCardComponent {
  private readonly gearAdvisor = inject(GearAdvisorService);

  readonly gearSlot = input.required<GearSlot>();
  readonly level = input.required<number>();
  /** Lo que lleva el personaje importado en esta ranura (vacío si no se ha importado). */
  readonly equippedItems = input<ScoredItem[]>([]);

  protected readonly recommendations = computed(() =>
    this.gearAdvisor.getRecommendations(this.gearSlot().key, this.level()),
  );
  protected readonly bestItem = computed(() => this.recommendations()[0] ?? null);
  protected readonly alternatives = computed(() => this.recommendations().slice(1));
  protected readonly upcomingUpgrade = computed(
    () => this.gearAdvisor.getUpcomingUpgrades(this.gearSlot().key, this.level(), 1)[0] ?? null,
  );

  // Con dos anillos o abalorios se compara con el peor de los dos
  protected readonly weakestEquippedItem = computed(
    () => [...this.equippedItems()].sort((first, second) => first.score - second.score)[0] ?? null,
  );
  protected readonly isUpgradeAvailable = computed(() => {
    const best = this.bestItem();
    const equipped = this.weakestEquippedItem();
    return !!best && !!equipped && best.item.id !== equipped.item.id && best.score - equipped.score > MIN_UPGRADE_SCORE_GAIN;
  });

  protected readonly describeItemBriefly = describeItemBriefly;
}
