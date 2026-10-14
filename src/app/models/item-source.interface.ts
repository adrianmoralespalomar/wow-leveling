import { Faction } from './faction.type';
import { ItemSourceKind } from './item-source-kind.type';

export interface ItemSource {
  kind: ItemSourceKind;
  label: string;
  place: string;
  level: number | null;
  faction: Faction;
}
