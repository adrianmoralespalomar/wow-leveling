import { computed, inject, Injectable } from '@angular/core';
import { DungeonWithLoot } from '../models/dungeon-with-loot.interface';
import { LevelingZone } from '../models/leveling-zone.interface';
import { Milestone } from '../models/milestone.interface';
import { MilestoneView } from '../models/milestone-view.interface';
import { TalentStep } from '../models/talent-step.interface';
import { getTalentIdForLevel, getTalentRanksAtLevel, getTreeIndex } from '../utils/talent-build.utils';
import { toTalentTooltip } from '../utils/tooltip-content.utils';
import { GameDataService } from './game-data.service';
import { GearAdvisorService } from './gear-advisor.service';
import { PlayerProgressService } from './player-progress.service';

const DUNGEON_EARLY_LEVELS = 2;

/** Cruza la guía curada (hitos, zonas, mazmorras, build) con el nivel del jugador. */
@Injectable({ providedIn: 'root' })
export class GuideService {
  private readonly gameData = inject(GameDataService);
  private readonly gearAdvisor = inject(GearAdvisorService);
  private readonly playerProgress = inject(PlayerProgressService);

  readonly milestones = computed(() => this.gameData.levelingGuide()?.milestones ?? []);

  getTalentStep(level: number): TalentStep | null {
    const build = this.playerProgress.talentBuild();
    const talentId = build ? getTalentIdForLevel(build, level) : null;
    const talent = talentId ? this.gameData.talentsById().get(talentId) : undefined;
    if (!build || !talentId || !talent) return null;
    const rank = getTalentRanksAtLevel(build, level)[talentId] ?? 0;
    return {
      level,
      talent,
      rank,
      treeName: this.gameData.talentTrees()[getTreeIndex(talentId)]?.name ?? '',
      tooltip: toTalentTooltip(talent, rank),
    };
  }

  getCurrentMilestones(level: number): MilestoneView[] {
    const reached = this.milestones().filter((milestone) => milestone.level <= level);
    const lastLevel = reached.at(-1)?.level;
    return reached.filter((milestone) => milestone.level === lastLevel).map((milestone) => this.toMilestoneView(milestone));
  }

  getNextMilestone(level: number): MilestoneView | null {
    const next = this.milestones().find((milestone) => milestone.level > level);
    return next ? this.toMilestoneView(next) : null;
  }

  toMilestoneView(milestone: Milestone): MilestoneView {
    const itemsById = this.gameData.itemsById();
    return {
      milestone,
      items: milestone.itemIds.map((itemId) => itemsById.get(itemId)),
      alternatives: milestone.alternativeItemIds.map((itemId) => itemsById.get(itemId)),
    };
  }

  getZonesForLevel(level: number): LevelingZone[] {
    return (this.gameData.levelingGuide()?.zones ?? []).filter((zone) => zone.minLevel <= level && level <= zone.maxLevel);
  }

  getDungeonsForLevel(level: number, lootLimit: number): DungeonWithLoot[] {
    return (this.gameData.levelingGuide()?.dungeons ?? [])
      .filter(
        (dungeon) =>
          dungeon.faction !== 'alliance' && dungeon.minLevel - DUNGEON_EARLY_LEVELS <= level && level <= dungeon.maxLevel,
      )
      .map((dungeon) => ({ dungeon, loot: this.gearAdvisor.getDungeonLoot(dungeon.lootPlace, lootLimit) }));
  }
}
