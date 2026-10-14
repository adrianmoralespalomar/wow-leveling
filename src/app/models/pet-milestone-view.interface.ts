import { BeastView } from './beast-view.interface';
import { PetMilestone } from './pet-milestone.interface';

export interface PetMilestoneView {
  milestone: PetMilestone;
  beasts: BeastView[];
  alternatives: BeastView[];
}
