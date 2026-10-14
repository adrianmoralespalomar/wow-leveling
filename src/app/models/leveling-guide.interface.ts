import { Dungeon } from './dungeon.interface';
import { LevelingTip } from './leveling-tip.interface';
import { LevelingZone } from './leveling-zone.interface';
import { Milestone } from './milestone.interface';

export interface LevelingGuide {
  updatedAt: string;
  note: string;
  zones: LevelingZone[];
  dungeons: Dungeon[];
  milestones: Milestone[];
  tips: LevelingTip[];
}
