export interface EquippedItem {
  /** Ranura de inventario del juego (1 = cabeza ... 18 = a distancia). */
  slotId: number;
  itemId: number;
  enchantId: number;
  quality: number;
  name: string;
}
