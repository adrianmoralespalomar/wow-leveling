import { GameMode } from './game-mode.type';

export interface TalentBuild {
  id: string;
  name: string;
  mode: GameMode;
  summary: string;
  verified: boolean;
  note: string;
  /** Un id de talento por nivel, empezando en el nivel 10. */
  points: string[];
}
