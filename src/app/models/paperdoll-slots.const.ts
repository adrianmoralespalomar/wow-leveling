import { PaperdollSlot } from './paperdoll-slot.interface';

export const PAPERDOLL_SLOTS: PaperdollSlot[] = [
  { inventoryId: 1, label: 'Cabeza', gearSlotKey: 'head', column: 'left', emptyIcon: 'inv_helmet_03' },
  { inventoryId: 2, label: 'Cuello', gearSlotKey: 'neck', column: 'left', emptyIcon: 'inv_jewelry_necklace_01' },
  { inventoryId: 3, label: 'Hombros', gearSlotKey: 'shoulder', column: 'left', emptyIcon: 'inv_shoulder_01' },
  { inventoryId: 15, label: 'Espalda', gearSlotKey: 'back', column: 'left', emptyIcon: 'inv_misc_cape_01' },
  { inventoryId: 5, label: 'Pecho', gearSlotKey: 'chest', column: 'left', emptyIcon: 'inv_chest_chain' },
  { inventoryId: 4, label: 'Camisa', gearSlotKey: null, column: 'left', emptyIcon: 'inv_shirt_01' },
  { inventoryId: 19, label: 'Tabardo', gearSlotKey: null, column: 'left', emptyIcon: 'inv_shirt_guildtabard_01' },
  { inventoryId: 9, label: 'Muñecas', gearSlotKey: 'wrist', column: 'left', emptyIcon: 'inv_bracer_01' },
  { inventoryId: 10, label: 'Manos', gearSlotKey: 'hands', column: 'right', emptyIcon: 'inv_gauntlets_01' },
  { inventoryId: 6, label: 'Cintura', gearSlotKey: 'waist', column: 'right', emptyIcon: 'inv_belt_01' },
  { inventoryId: 7, label: 'Piernas', gearSlotKey: 'legs', column: 'right', emptyIcon: 'inv_pants_01' },
  { inventoryId: 8, label: 'Pies', gearSlotKey: 'feet', column: 'right', emptyIcon: 'inv_boots_01' },
  { inventoryId: 11, label: 'Anillo 1', gearSlotKey: 'finger', column: 'right', emptyIcon: 'inv_jewelry_ring_01' },
  { inventoryId: 12, label: 'Anillo 2', gearSlotKey: 'finger', column: 'right', emptyIcon: 'inv_jewelry_ring_01' },
  { inventoryId: 13, label: 'Abalorio 1', gearSlotKey: 'trinket', column: 'right', emptyIcon: 'inv_misc_gem_01' },
  { inventoryId: 14, label: 'Abalorio 2', gearSlotKey: 'trinket', column: 'right', emptyIcon: 'inv_misc_gem_01' },
  { inventoryId: 16, label: 'Mano principal', gearSlotKey: 'melee', column: 'bottom', emptyIcon: 'inv_axe_01' },
  { inventoryId: 17, label: 'Mano secundaria', gearSlotKey: null, column: 'bottom', emptyIcon: 'inv_sword_04' },
  { inventoryId: 18, label: 'A distancia', gearSlotKey: 'ranged', column: 'bottom', emptyIcon: 'inv_weapon_bow_02' },
];
