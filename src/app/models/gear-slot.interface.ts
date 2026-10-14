import { GearSlotKey } from './gear-slot-key.type';

export interface GearSlot {
  key: GearSlotKey;
  label: string;
  /** Valores de Item.slot que encajan en esta ranura. */
  itemSlots: string[];
}
