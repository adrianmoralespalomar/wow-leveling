import { ItemSource } from './item-source.interface';
import { ItemStatus } from './item-status.type';

export interface Item {
  id: number;
  name: string;
  quality: number;
  itemLevel: number;
  requiredLevel: number;
  slot: string;
  itemClass: number;
  itemSubclass: number;
  icon: string;
  status: ItemStatus;
  /** Líneas del tooltip del juego; el tabulador separa el texto izquierdo del derecho. */
  tooltip: string[];
  speed: number | null;
  dps: number | null;
  quiverSpeed: number | null;
  /** Stats por identificador del juego (3 = Agilidad, 7 = Aguante, 38 = Poder de ataque...). */
  stats: Record<string, number>;
  source: ItemSource | null;
}
