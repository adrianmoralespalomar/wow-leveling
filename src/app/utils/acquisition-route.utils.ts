import { AcquisitionRoute } from '../models/acquisition-route.type';
import { Item } from '../models/item.interface';

const BIND_ON_EQUIP_LINE = 'Binds when equipped';

export function isBindOnEquip(item: Item): boolean {
  return item.tooltip.includes(BIND_ON_EQUIP_LINE);
}

/** Vía práctica para conseguir el objeto. Lo fabricado y lo de vendedor mantienen su vía aunque se pueda revender. */
export function getAcquisitionRoute(item: Item): AcquisitionRoute {
  const kind = item.source?.kind;
  if (kind === 'quest' || kind === 'vendor' || kind === 'crafted' || kind === 'rare' || kind === 'pvp') return kind;
  if (isBindOnEquip(item)) return 'auction';
  return kind === 'dungeon' ? 'dungeon' : 'other';
}
