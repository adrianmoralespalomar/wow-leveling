export interface Talent {
  /** Formato árbol-fila-columna, por ejemplo 1-4-2. */
  id: string;
  name: string;
  row: number;
  column: number;
  maxRank: number;
  icon: string;
  passive: boolean;
  prerequisiteId: string | null;
  cost: string | null;
  ranks: string[];
}
