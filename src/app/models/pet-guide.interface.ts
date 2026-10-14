import { PetFamilyGuide } from './pet-family-guide.interface';
import { PetMilestone } from './pet-milestone.interface';

export interface PetGuide {
  updatedAt: string;
  rules: string[];
  families: PetFamilyGuide[];
  milestones: PetMilestone[];
}
