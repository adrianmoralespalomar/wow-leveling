import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ItemLinkComponent } from '../../components/item-link/item-link.component';
import { MilestoneCardComponent } from '../../components/milestone-card/milestone-card.component';
import { PetMilestoneCardComponent } from '../../components/pet-milestone-card/pet-milestone-card.component';
import { MAX_LEVEL, MIN_LEVEL } from '../../models/level-limits.const';
import { RouteBracket } from '../../models/route-bracket.interface';
import { GameDataService } from '../../services/game-data.service';
import { GearAdvisorService } from '../../services/gear-advisor.service';
import { GuideService } from '../../services/guide.service';
import { PetGuideService } from '../../services/pet-guide.service';
import { PlayerProgressService } from '../../services/player-progress.service';

const BRACKET_SIZE = 10;
const DUNGEON_LOOT_LIMIT = 5;

@Component({
  selector: 'app-route-page',
  imports: [ItemLinkComponent, MilestoneCardComponent, PetMilestoneCardComponent],
  templateUrl: './route-page.component.html',
  styleUrl: './route-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutePageComponent {
  protected readonly gameData = inject(GameDataService);
  private readonly gearAdvisor = inject(GearAdvisorService);
  private readonly guideService = inject(GuideService);
  private readonly petGuide = inject(PetGuideService);
  protected readonly playerProgress = inject(PlayerProgressService);

  protected readonly brackets = computed<RouteBracket[]>(() => {
    const guide = this.gameData.levelingGuide();
    if (!guide) return [];
    return Array.from({ length: MAX_LEVEL / BRACKET_SIZE }, (_, index) => {
      const fromLevel = index * BRACKET_SIZE + MIN_LEVEL;
      const toLevel = fromLevel + BRACKET_SIZE - 1;
      return {
        fromLevel,
        toLevel,
        zones: guide.zones.filter((zone) => zone.minLevel <= toLevel && zone.maxLevel >= fromLevel),
        dungeons: guide.dungeons
          .filter((dungeon) => dungeon.minLevel >= fromLevel && dungeon.minLevel <= toLevel)
          .map((dungeon) => ({ dungeon, loot: this.gearAdvisor.getDungeonLoot(dungeon.lootPlace, DUNGEON_LOOT_LIMIT) })),
        milestones: guide.milestones
          .filter((milestone) => milestone.level >= fromLevel && milestone.level <= toLevel)
          .map((milestone) => this.guideService.toMilestoneView(milestone)),
        petMilestones: this.petGuide.getMilestonesBetween(fromLevel, toLevel),
      };
    });
  });

  protected toBarStart(level: number): number {
    return (level - MIN_LEVEL) / (MAX_LEVEL - MIN_LEVEL + 1);
  }

  protected toBarWidth(minLevel: number, maxLevel: number): number {
    return (maxLevel - minLevel + 1) / (MAX_LEVEL - MIN_LEVEL + 1);
  }
}
