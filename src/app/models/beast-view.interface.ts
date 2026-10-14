import { PetFamily } from './pet-family.interface';
import { PetFamilyGuide } from './pet-family-guide.interface';
import { SpellTooltipContent } from './spell-tooltip-content.interface';
import { TameableBeast } from './tameable-beast.interface';

/** Bestia domable con su familia ya resuelta, lista para pintar. */
export interface BeastView {
  beast: TameableBeast;
  family: PetFamily | undefined;
  familyGuide: PetFamilyGuide | undefined;
  levelText: string;
  mapUrl: string;
  tooltip: SpellTooltipContent;
}
