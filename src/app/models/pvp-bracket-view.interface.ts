import { Item } from './item.interface';
import { PvpBracket } from './pvp-bracket.interface';

/** Tramo con sus objetos ya resueltos (undefined si el objeto no está en los datos). */
export interface PvpBracketView {
  bracket: PvpBracket;
  items: (Item | undefined)[];
}
