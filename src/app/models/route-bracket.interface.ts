import { DungeonWithLoot } from './dungeon-with-loot.interface';
import { LevelingZone } from './leveling-zone.interface';
import { MilestoneView } from './milestone-view.interface';
import { PetMilestoneView } from './pet-milestone-view.interface';

/** Tramo de 10 niveles de la ruta de subida. */
export interface RouteBracket {
  fromLevel: number;
  toLevel: number;
  zones: LevelingZone[];
  dungeons: DungeonWithLoot[];
  milestones: MilestoneView[];
  petMilestones: PetMilestoneView[];
}
