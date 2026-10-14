/** Bestia que enseña un rango de habilidad al domarla. */
export interface PetAbilityTeacher {
  id: number;
  name: string;
  family: string;
  minLevel: number | null;
  maxLevel: number | null;
  zone: string;
  isDungeon: boolean;
}
