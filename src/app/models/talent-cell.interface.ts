import { SpellTooltipContent } from './spell-tooltip-content.interface';
import { Talent } from './talent.interface';

export interface TalentCell {
  talent: Talent;
  rank: number;
  isCurrent: boolean;
  isInBuild: boolean;
  tooltip: SpellTooltipContent;
}
