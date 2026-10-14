import { SpellTooltipContent } from './spell-tooltip-content.interface';
import { Talent } from './talent.interface';

/** Punto de talento que toca poner en un nivel concreto. */
export interface TalentStep {
  level: number;
  talent: Talent;
  rank: number;
  treeName: string;
  tooltip: SpellTooltipContent;
}
