import { PetAbilityProgress } from './pet-ability-progress.interface';

/** Rangos de habilidad que la mascota desbloquea al llegar a un nivel. */
export interface PetAbilityUnlock {
  level: number;
  entries: PetAbilityProgress[];
}
