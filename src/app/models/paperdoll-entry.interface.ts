import { EquippedItem } from './equipped-item.interface';
import { Item } from './item.interface';
import { PaperdollSlot } from './paperdoll-slot.interface';
import { ScoredItem } from './scored-item.interface';

export interface PaperdollEntry {
  slot: PaperdollSlot;
  equipped: EquippedItem | null;
  /** Datos del objeto equipado si está en el JSON de objetos. */
  item: Item | undefined;
  upgrade: ScoredItem | null;
}
