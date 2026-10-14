import { BeastView } from './beast-view.interface';
import { PetAbility } from './pet-ability.interface';
import { PetAbilityRank } from './pet-ability-rank.interface';
import { SpellTooltipContent } from './spell-tooltip-content.interface';

/** Rango más alto de una habilidad que tu mascota puede aprender a tu nivel y cómo conseguirlo. */
export interface PetAbilityProgress {
  ability: PetAbility;
  currentRank: PetAbilityRank | null;
  nextRank: PetAbilityRank | null;
  /** Bestias que enseñan el rango actual y puedes domar (vacío si lo enseña el instructor). */
  teachers: BeastView[];
  /** Ninguna bestia lo enseña a tu nivel: teachers son las más cercanas por encima. */
  areTeachersAboveLevel: boolean;
  tooltip: SpellTooltipContent;
}
