import { PetFamily } from './pet-family.interface';
import { TameableBeast } from './tameable-beast.interface';

export interface PetsData {
  source: string;
  families: PetFamily[];
  beasts: TameableBeast[];
}
