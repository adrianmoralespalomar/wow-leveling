import { DataMeta } from './data-meta.interface';

export interface DataRefreshResult {
  ok: boolean;
  /** Salida del script de generación (o el error). */
  output: string;
  meta: DataMeta | null;
}
