import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AddonGroup } from '../../models/addon-group.interface';
import { GameDataService } from '../../services/game-data.service';

@Component({
  selector: 'app-addons-page',
  imports: [RouterLink],
  templateUrl: './addons-page.component.html',
  styleUrl: './addons-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddonsPageComponent {
  private readonly gameData = inject(GameDataService);

  protected readonly addonsData = this.gameData.addonsData;

  protected readonly groups = computed<AddonGroup[]>(() => {
    const groups = new Map<string, AddonGroup>();
    for (const addon of this.addonsData()?.addons ?? []) {
      const group = groups.get(addon.category) ?? { category: addon.category, addons: [] };
      group.addons.push(addon);
      groups.set(addon.category, group);
    }
    return [...groups.values()];
  });
}
