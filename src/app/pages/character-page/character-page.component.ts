import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameIconComponent } from '../../components/game-icon/game-icon.component';
import { ItemLinkComponent } from '../../components/item-link/item-link.component';
import { PaperdollEntry } from '../../models/paperdoll-entry.interface';
import { PAPERDOLL_SLOTS } from '../../models/paperdoll-slots.const';
import { SAMPLE_CHARACTER_EXPORT } from '../../models/sample-character-export.const';
import { CharacterService } from '../../services/character.service';
import { GameDataService } from '../../services/game-data.service';
import { GearAdvisorService } from '../../services/gear-advisor.service';
import { PlayerProgressService } from '../../services/player-progress.service';
import { formatDecimal } from '../../utils/item-description.utils';
import { getTalentRanksAtLevel } from '../../utils/talent-build.utils';

const MIN_UPGRADE_SCORE_GAIN = 0.5;

@Component({
  selector: 'app-character-page',
  imports: [GameIconComponent, ItemLinkComponent, RouterLink],
  templateUrl: './character-page.component.html',
  styleUrl: './character-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterPageComponent {
  protected readonly characterService = inject(CharacterService);
  private readonly gameData = inject(GameDataService);
  private readonly gearAdvisor = inject(GearAdvisorService);
  protected readonly playerProgress = inject(PlayerProgressService);

  protected readonly draftExport = signal('');
  protected readonly character = this.characterService.character;

  protected readonly characterSummary = computed(() => {
    const character = this.character();
    if (!character) return '';
    const petText = character.pet ? `. Mascota: ${character.pet.family} de nivel ${character.pet.level}` : '';
    return `Nivel ${character.level}, ${character.zone}${petText}`;
  });
  protected readonly experienceSummary = computed(() => {
    const character = this.character();
    if (!character) return '';
    const restedText = character.restedExperience ? `, ${character.restedExperience} de descanso` : '';
    return `${character.experience} / ${character.experienceToLevel} de experiencia${restedText}`;
  });
  protected readonly experiencePercent = computed(() => {
    const character = this.character();
    return character?.experienceToLevel ? (character.experience / character.experienceToLevel) * 100 : 0;
  });
  protected readonly restedPercent = computed(() => {
    const character = this.character();
    if (!character?.experienceToLevel) return 0;
    return Math.min(100 - this.experiencePercent(), (character.restedExperience / character.experienceToLevel) * 100);
  });

  protected readonly paperdollEntries = computed<PaperdollEntry[]>(() => {
    const character = this.character();
    if (!character) return [];
    const itemsById = this.gameData.itemsById();
    return PAPERDOLL_SLOTS.map((slot) => {
      const equipped = character.equipment.find((equippedItem) => equippedItem.slotId === slot.inventoryId) ?? null;
      const item = equipped ? itemsById.get(equipped.itemId) : undefined;
      const best = slot.gearSlotKey ? this.gearAdvisor.getRecommendations(slot.gearSlotKey, character.level, 1)[0] : undefined;
      const equippedScore = item ? this.gearAdvisor.toScoredItem(item).score : 0;
      const isUpgrade = !!best && best.item.id !== item?.id && best.score - equippedScore > MIN_UPGRADE_SCORE_GAIN;
      return { slot, equipped, item, upgrade: isUpgrade && best ? best : null };
    });
  });
  protected readonly leftEntries = computed(() => this.paperdollEntries().filter((entry) => entry.slot.column === 'left'));
  protected readonly rightEntries = computed(() => this.paperdollEntries().filter((entry) => entry.slot.column === 'right'));
  protected readonly bottomEntries = computed(() => this.paperdollEntries().filter((entry) => entry.slot.column === 'bottom'));
  protected readonly upgradeCount = computed(() => this.paperdollEntries().filter((entry) => entry.upgrade).length);

  protected readonly treeNames = computed(() => this.gameData.talentTrees().map((tree) => tree.name));
  protected readonly treePoints = computed(() => this.countTreePoints(this.character()?.talentRanks ?? {}));
  protected readonly buildTreePoints = computed(() => {
    const build = this.playerProgress.talentBuild();
    const character = this.character();
    return build && character ? this.countTreePoints(getTalentRanksAtLevel(build, character.level)) : [];
  });

  protected readonly formatDecimal = formatDecimal;

  protected onDraftExportChanged(event: Event): void {
    this.draftExport.set((event.target as HTMLTextAreaElement).value);
  }

  protected onLoadCharacterClicked(): void {
    this.characterService.rawExport.set(this.draftExport().trim());
    const character = this.characterService.character();
    if (character) this.playerProgress.setLevel(character.level);
  }

  protected onSampleCharacterClicked(): void {
    this.draftExport.set(SAMPLE_CHARACTER_EXPORT);
    this.onLoadCharacterClicked();
  }

  protected onUseCharacterLevelClicked(level: number): void {
    this.playerProgress.setLevel(level);
  }

  protected onChangeCharacterClicked(): void {
    this.draftExport.set(this.characterService.rawExport());
    this.characterService.rawExport.set('');
  }

  private countTreePoints(talentRanks: Record<string, number>): number[] {
    return this.gameData
      .talentTrees()
      .map((tree) => tree.talents.reduce((total, talent) => total + (talentRanks[talent.id] ?? 0), 0));
  }
}
