import { ItemSourceKind } from './item-source-kind.type';

export const ITEM_SOURCE_KIND_LABELS: Record<ItemSourceKind, string> = {
  quest: 'Misión',
  vendor: 'Vendedor',
  crafted: 'Fabricado',
  creature: 'Criatura',
  world: 'Botín aleatorio',
  dungeon: 'Mazmorra',
  rare: 'Élite raro',
  pvp: 'Campo de batalla',
  other: 'Otro',
};
