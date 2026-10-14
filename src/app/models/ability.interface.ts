import { AbilitySchool } from './ability-school.type';

export interface Ability {
  name: string;
  school: AbilitySchool;
  rank: number;
  level: number;
  icon: string;
  status: string;
  cost: string;
  description: string;
}
