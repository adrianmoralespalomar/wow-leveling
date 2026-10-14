import { Item } from './item.interface';

export interface ScoredItem {
  item: Item;
  score: number;
  minLevel: number;
}
