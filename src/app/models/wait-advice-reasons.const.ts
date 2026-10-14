import { AcquisitionRoute } from './acquisition-route.type';

/** Qué te ahorras si esperas a la mejora fácil, según de dónde sale la mejor pieza de ahora. */
export const WAIT_ADVICE_REASONS: Partial<Record<AcquisitionRoute, string>> = {
  dungeon: 'No hace falta repetir la mazmorra por esta ranura',
  auction: 'No gastes oro en la subasta',
  crafted: 'No compensa fabricarlo ni encargarlo',
  rare: 'No pierdas tiempo buscando al élite raro',
  pvp: 'No hace falta subir la reputación para esto',
};
