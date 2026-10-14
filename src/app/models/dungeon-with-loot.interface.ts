import { Dungeon } from './dungeon.interface';
import { ScoredItem } from './scored-item.interface';

export interface DungeonWithLoot {
  dungeon: Dungeon;
  loot: ScoredItem[];
}
