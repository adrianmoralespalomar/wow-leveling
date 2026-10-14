import { Item } from './item.interface';
import { Milestone } from './milestone.interface';

/** Hito de la guía con sus objetos ya resueltos (undefined si el objeto no está en los datos). */
export interface MilestoneView {
  milestone: Milestone;
  items: (Item | undefined)[];
  alternatives: (Item | undefined)[];
}
