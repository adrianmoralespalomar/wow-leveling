import { PetFamily } from './pet-family.interface';
import { PetFamilyGuide } from './pet-family-guide.interface';

export interface PetFamilyView {
  family: PetFamily;
  guide: PetFamilyGuide;
  beastCount: number;
}
