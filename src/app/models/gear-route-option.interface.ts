import { AcquisitionRoute } from './acquisition-route.type';
import { ScoredItem } from './scored-item.interface';

/** Una forma de cubrir una ranura: el mejor objeto de esa vía. */
export interface GearRouteOption {
  route: AcquisitionRoute;
  scoredItem: ScoredItem;
}
