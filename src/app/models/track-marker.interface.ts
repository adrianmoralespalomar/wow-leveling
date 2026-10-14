import { SpellTooltipContent } from './spell-tooltip-content.interface';

export interface TrackMarker {
  level: number;
  /** Posición en la barra, de 0 a 1. */
  position: number;
  isReached: boolean;
  tooltip: SpellTooltipContent;
}
