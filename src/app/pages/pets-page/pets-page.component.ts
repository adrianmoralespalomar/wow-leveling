import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { BeastLinkComponent } from '../../components/beast-link/beast-link.component';
import { GameIconComponent } from '../../components/game-icon/game-icon.component';
import { PetMilestoneCardComponent } from '../../components/pet-milestone-card/pet-milestone-card.component';
import { TooltipDirective } from '../../components/tooltip/tooltip.directive';
import { PET_FAMILY_TIER_LABELS } from '../../models/pet-family-tier-labels.const';
import { GameDataService } from '../../services/game-data.service';
import { PetGuideService } from '../../services/pet-guide.service';
import { PlayerProgressService } from '../../services/player-progress.service';

const NEARBY_BEASTS_LIMIT = 12;

@Component({
  selector: 'app-pets-page',
  imports: [BeastLinkComponent, GameIconComponent, PetMilestoneCardComponent, TooltipDirective],
  templateUrl: './pets-page.component.html',
  styleUrl: './pets-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetsPageComponent {
  protected readonly gameData = inject(GameDataService);
  protected readonly petGuide = inject(PetGuideService);
  protected readonly playerProgress = inject(PlayerProgressService);

  protected readonly tierLabels = PET_FAMILY_TIER_LABELS;
  protected readonly nearbyBeasts = computed(() =>
    this.petGuide.getNearbyBeasts(this.playerProgress.level(), NEARBY_BEASTS_LIMIT),
  );
  protected readonly abilityProgress = computed(() =>
    this.petGuide.getAbilityProgress(this.playerProgress.petFamilyName(), this.playerProgress.level()),
  );
  protected readonly currentMilestoneLevel = computed(
    () => this.petGuide.getCurrentMilestone(this.playerProgress.level())?.milestone.level ?? null,
  );

  protected onPetFamilySelected(event: Event): void {
    this.playerProgress.petFamilyName.set((event.target as HTMLSelectElement).value);
  }
}
