import { PetFamily } from './pet-family.interface';
import { PvpPetPick } from './pvp-pet-pick.interface';

export interface PvpPetPickView {
  pick: PvpPetPick;
  family: PetFamily | undefined;
  /** Habilidad propia de la familia según pet-guide.json. */
  ability: string | null;
}
