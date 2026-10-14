import { ITEM_SOURCE_KIND_LABELS } from '../models/item-source-kind-labels.const';
import { Item } from '../models/item.interface';
import { isBindOnEquip } from './acquisition-route.utils';

const DECIMAL_FORMAT = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 });

export function formatDecimal(value: number): string {
  return DECIMAL_FORMAT.format(value);
}

/** Texto corto de dónde sale el objeto: "Lord Serpentis, Wailing Caverns". */
export function describeItemSource(item: Item): string {
  const source = item.source;
  if (!source) return 'Procedencia desconocida';
  if (source.kind === 'dungeon') {
    const auctionText = isBindOnEquip(item) ? ' o subasta' : '';
    return `${source.label === 'Any enemy' ? 'Cualquier enemigo' : source.label}, ${source.place}${auctionText}`;
  }
  if (source.kind === 'world') return isBindOnEquip(item) ? 'Subasta (botín aleatorio)' : 'Botín aleatorio';
  if (source.kind === 'quest') return `Misión ${source.label}`;
  if (source.kind === 'crafted') return source.label;
  if (source.kind === 'rare') return `${source.label} (élite raro)`;
  if (source.kind === 'pvp') return `${source.label}, ${source.place}`;
  if (source.kind === 'creature') return `${source.label}, ${source.place}`;
  return ITEM_SOURCE_KIND_LABELS[source.kind];
}

/** Detalle para listados: DPS en armas a distancia y procedencia. */
export function describeItemBriefly(item: Item): string {
  const dpsText = item.slot === 'Ranged' && item.dps ? `${formatDecimal(item.dps)} DPS, ` : '';
  return `${dpsText}${describeItemSource(item)}`;
}
