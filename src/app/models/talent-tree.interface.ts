import { Talent } from './talent.interface';

export interface TalentTree {
  id: string;
  name: string;
  icon: string;
  talents: Talent[];
}
