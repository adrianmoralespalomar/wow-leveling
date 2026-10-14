import { PetAbilityTeacher } from './pet-ability-teacher.interface';

export interface PetAbilityRank {
  rank: number;
  /** Nivel mínimo de la mascota para aprender este rango. */
  petLevel: number;
  trainingPointCost: number;
  description: string;
  teachers: PetAbilityTeacher[];
}
