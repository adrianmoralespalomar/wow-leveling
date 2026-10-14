import { CharacterPet } from './character-pet.interface';
import { EquippedItem } from './equipped-item.interface';

export interface CharacterExport {
  name: string;
  race: string;
  className: string;
  level: number;
  experience: number;
  experienceToLevel: number;
  restedExperience: number;
  zone: string;
  pet: CharacterPet | null;
  equipment: EquippedItem[];
  /** Rango por id de talento (árbol-fila-columna). */
  talentRanks: Record<string, number>;
}
