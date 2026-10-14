import { PetFamilyTier } from './pet-family-tier.type';

export interface PetFamilyGuide {
  /** Id de la familia en pets.json. */
  id: number;
  /** Habilidad propia de la familia (nombre en inglés). */
  ability: string;
  tier: PetFamilyTier;
  role: string;
}
