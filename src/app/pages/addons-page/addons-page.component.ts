import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AddonGroup } from '../../models/addon-group.interface';
import { GameDataService } from '../../services/game-data.service';
import { PlayerProgressService } from '../../services/player-progress.service';

@Component({
  selector: 'app-addons-page',
  imports: [RouterLink],
  templateUrl: './addons-page.component.html',
  styleUrl: './addons-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddonsPageComponent {
  private readonly gameData = inject(GameDataService);
  protected readonly playerProgress = inject(PlayerProgressService);

  protected readonly addonsData = this.gameData.addonsData;

  protected readonly groups = computed<AddonGroup[]>(() => {
    const groups = new Map<string, AddonGroup>();
    const gameMode = this.playerProgress.gameMode();
    const addons = (this.addonsData()?.addons ?? []).filter((addon) => addon.mode === 'both' || addon.mode === gameMode);
    // En modo PvP, los de campos de batalla van primero
    if (gameMode === 'pvp') addons.sort((first, second) => Number(second.mode === 'pvp') - Number(first.mode === 'pvp'));
    for (const addon of addons) {
      const group = groups.get(addon.category) ?? { category: addon.category, addons: [] };
      group.addons.push(addon);
      groups.set(addon.category, group);
    }
    return [...groups.values()];
  });
}
