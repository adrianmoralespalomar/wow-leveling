import { PetAbilityRank } from './pet-ability-rank.interface';

export interface PetAbility {
  name: string;
  icon: string | null;
  description: string;
  /** Familias que pueden aprenderla, en inglés; '*' si son todas. */
  families: string[];
  isFromTrainer: boolean;
  ranks: PetAbilityRank[];
}
