/** Tramo de nivel de los campos de batalla: con quién te emparejan y qué llevar. */
export interface PvpBracket {
  minLevel: number;
  maxLevel: number;
  battlegrounds: string[];
  summary: string;
  priorities: string[];
  itemIds: number[];
  /** Consejo para quien quiera quedarse en el tramo (twink); null si no compensa. */
  twinkNote: string | null;
}
