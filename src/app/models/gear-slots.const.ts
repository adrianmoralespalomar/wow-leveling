import { GearSlot } from './gear-slot.interface';

export const GEAR_SLOTS: GearSlot[] = [
  { key: 'ranged', label: 'A distancia', itemSlots: ['Ranged'] },
  { key: 'melee', label: 'Cuerpo a cuerpo', itemSlots: ['Two-Hand', 'One-Hand', 'Main Hand'] },
  { key: 'head', label: 'Cabeza', itemSlots: ['Head'] },
  { key: 'neck', label: 'Cuello', itemSlots: ['Neck'] },
  { key: 'shoulder', label: 'Hombros', itemSlots: ['Shoulder'] },
  { key: 'back', label: 'Espalda', itemSlots: ['Back'] },
  { key: 'chest', label: 'Pecho', itemSlots: ['Chest'] },
  { key: 'wrist', label: 'Muñecas', itemSlots: ['Wrist'] },
  { key: 'hands', label: 'Manos', itemSlots: ['Hands'] },
  { key: 'waist', label: 'Cintura', itemSlots: ['Waist'] },
  { key: 'legs', label: 'Piernas', itemSlots: ['Legs'] },
  { key: 'feet', label: 'Pies', itemSlots: ['Feet'] },
  { key: 'finger', label: 'Anillo', itemSlots: ['Finger'] },
  { key: 'trinket', label: 'Abalorio', itemSlots: ['Trinket'] },
  { key: 'ammo', label: 'Munición', itemSlots: ['Ammo'] },
  { key: 'quiver', label: 'Carcaj', itemSlots: ['Bag'] },
];
