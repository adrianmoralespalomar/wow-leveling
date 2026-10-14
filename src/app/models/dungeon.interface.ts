import { Faction } from './faction.type';

export interface Dungeon {
  name: string;
  /** Zona en el cliente en inglés. */
  zone: string;
  zoneSpanishName: string;
  minLevel: number;
  maxLevel: number;
  faction: Faction;
  isNew: boolean;
  /** Nombre del lugar tal como aparece en la procedencia de los objetos. */
  lootPlace: string;
  note?: string;
}
