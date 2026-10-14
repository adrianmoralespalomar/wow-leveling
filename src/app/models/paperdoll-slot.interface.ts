import { GearSlotKey } from './gear-slot-key.type';
import { PaperdollColumn } from './paperdoll-column.type';

export interface PaperdollSlot {
  inventoryId: number;
  label: string;
  gearSlotKey: GearSlotKey | null;
  column: PaperdollColumn;
  /** Icono que muestra el juego en la ranura vacía. */
  emptyIcon: string;
}
