import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameIconComponent } from '../../components/game-icon/game-icon.component';
import { GearSlotCardComponent } from '../../components/gear-slot-card/gear-slot-card.component';
import { ItemLinkComponent } from '../../components/item-link/item-link.component';
import { MilestoneCardComponent } from '../../components/milestone-card/milestone-card.component';
import { BeastLinkComponent } from '../../components/beast-link/beast-link.component';
import { PetMilestoneCardComponent } from '../../components/pet-milestone-card/pet-milestone-card.component';
import { TooltipDirective } from '../../components/tooltip/tooltip.directive';
import { GEAR_SLOTS } from '../../models/gear-slots.const';
import { FIRST_TALENT_LEVEL, MAX_LEVEL } from '../../models/level-limits.const';
import { CharacterService } from '../../services/character.service';
import { GameDataService } from '../../services/game-data.service';
import { GuideService } from '../../services/guide.service';
import { PetGuideService } from '../../services/pet-guide.service';
import { PlayerProgressService } from '../../services/player-progress.service';
import { TrainingService } from '../../services/training.service';
import { toAbilityTooltip } from '../../utils/tooltip-content.utils';

const DUNGEON_LOOT_LIMIT = 4;
const NEARBY_BEASTS_LIMIT = 4;
const RANGED_SLOT = GEAR_SLOTS.find((gearSlot) => gearSlot.key === 'ranged')!;

@Component({
  selector: 'app-now-page',
  imports: [
    BeastLinkComponent,
    GameIconComponent,
    GearSlotCardComponent,
    ItemLinkComponent,
    MilestoneCardComponent,
    PetMilestoneCardComponent,
    RouterLink,
    TooltipDirective,
  ],
  templateUrl: './now-page.component.html',
  styleUrl: './now-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NowPageComponent {
  private readonly characterService = inject(CharacterService);
  private readonly gameData = inject(GameDataService);
  private readonly guideService = inject(GuideService);
  private readonly petGuide = inject(PetGuideService);
  protected readonly playerProgress = inject(PlayerProgressService);
  private readonly trainingService = inject(TrainingService);

  protected readonly firstTalentLevel = FIRST_TALENT_LEVEL;
  protected readonly rangedSlot = RANGED_SLOT;
  protected readonly otherGearSlots = GEAR_SLOTS.filter((gearSlot) => gearSlot.key !== 'ranged');

  protected readonly level = this.playerProgress.level;
  protected readonly talentStep = computed(() => this.guideService.getTalentStep(this.level()));
  protected readonly nextTalentStep = computed(() =>
    this.level() < MAX_LEVEL ? this.guideService.getTalentStep(this.level() + 1) : null,
  );

  protected readonly abilitiesNow = computed(() =>
    this.trainingService.getAbilitiesForLevel(this.level()).map((ability) => ({ ability, tooltip: toAbilityTooltip(ability) })),
  );
  protected readonly nextTrainingLevel = computed(() => this.trainingService.getNextTrainingLevel(this.level()));
  protected readonly abilitiesNext = computed(() => {
    const nextLevel = this.nextTrainingLevel();
    if (!nextLevel) return [];
    return this.trainingService.getAbilitiesForLevel(nextLevel).map((ability) => ({ ability, tooltip: toAbilityTooltip(ability) }));
  });

  protected readonly currentMilestones = computed(() => this.guideService.getCurrentMilestones(this.level()));
  protected readonly nextMilestone = computed(() => this.guideService.getNextMilestone(this.level()));

  protected readonly currentPetMilestone = computed(() => this.petGuide.getCurrentMilestone(this.level()));
  protected readonly nextPetMilestone = computed(() => this.petGuide.getNextMilestone(this.level()));
  protected readonly nearbyBeasts = computed(() => this.petGuide.getNearbyBeasts(this.level(), NEARBY_BEASTS_LIMIT));
  protected readonly petAbilityUnlock = computed(() =>
    this.petGuide.getUpcomingAbilityRanks(this.playerProgress.petFamilyName(), this.level()),
  );
  protected readonly characterPet = computed(() => this.characterService.character()?.pet ?? null);

  protected readonly zones = computed(() => this.guideService.getZonesForLevel(this.level()));
  protected readonly dungeons = computed(() => this.guideService.getDungeonsForLevel(this.level(), DUNGEON_LOOT_LIMIT));

  protected readonly equippedItemsBySlot = this.characterService.equippedItemsBySlot;
  protected readonly hasCharacter = computed(() => !!this.characterService.character());
  protected readonly isLoadingItems = this.gameData.isLoadingItems;

  protected onRandomDropsToggled(event: Event): void {
    this.playerProgress.includeRandomDrops.set((event.target as HTMLInputElement).checked);
  }
}
