import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ItemLinkComponent } from '../../components/item-link/item-link.component';
import { GearSlotKey } from '../../models/gear-slot-key.type';
import { GEAR_SLOTS } from '../../models/gear-slots.const';
import { GearAdvisorService } from '../../services/gear-advisor.service';
import { PlayerProgressService } from '../../services/player-progress.service';
import { describeItemSource, formatDecimal } from '../../utils/item-description.utils';

const LEVEL_WINDOW = 8;

@Component({
  selector: 'app-gear-page',
  imports: [ItemLinkComponent],
  templateUrl: './gear-page.component.html',
  styleUrl: './gear-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GearPageComponent {
  private readonly gearAdvisor = inject(GearAdvisorService);
  protected readonly playerProgress = inject(PlayerProgressService);

  protected readonly gearSlots = GEAR_SLOTS;
  protected readonly levelWindow = LEVEL_WINDOW;
  protected readonly selectedSlotKey = signal<GearSlotKey>('ranged');
  protected readonly showAllLevels = signal(false);

  protected readonly bestItemId = computed(
    () => this.gearAdvisor.getRecommendations(this.selectedSlotKey(), this.playerProgress.level(), 1)[0]?.item.id ?? null,
  );

  protected readonly rows = computed(() => {
    const level = this.playerProgress.level();
    return this.gearAdvisor
      .getSlotItems(this.selectedSlotKey())
      .filter(
        (scoredItem) =>
          this.gearAdvisor.isRecommendable(scoredItem.item) &&
          (this.showAllLevels() || Math.abs(scoredItem.minLevel - level) <= LEVEL_WINDOW),
      )
      .sort((first, second) => first.minLevel - second.minLevel || second.score - first.score);
  });

  protected readonly describeItemSource = describeItemSource;
  protected readonly formatDecimal = formatDecimal;

  protected onSlotSelected(gearSlotKey: GearSlotKey): void {
    this.selectedSlotKey.set(gearSlotKey);
  }

  protected onShowAllLevelsToggled(event: Event): void {
    this.showAllLevels.set((event.target as HTMLInputElement).checked);
  }

  protected onRandomDropsToggled(event: Event): void {
    this.playerProgress.includeRandomDrops.set((event.target as HTMLInputElement).checked);
  }
}
