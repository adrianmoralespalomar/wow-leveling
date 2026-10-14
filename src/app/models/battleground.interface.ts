export interface Battleground {
  name: string;
  minLevel: number;
  maxLevel: number;
  teamSize: string;
  objective: string;
  /** Facción de reputación de la Horda en este campo. */
  hordeReputation: string;
  /** Ranuras que compran las marcas de este campo. */
  markSlots: string;
  isNew: boolean;
  isPlayableInBeta: boolean;
  note: string;
}
