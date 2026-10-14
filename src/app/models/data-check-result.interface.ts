import { DataMeta } from './data-meta.interface';
import { RemoteDataVersions } from './remote-data-versions.interface';

export interface DataCheckResult {
  hasUpdates: boolean;
  local: DataMeta | null;
  remote: RemoteDataVersions;
}
