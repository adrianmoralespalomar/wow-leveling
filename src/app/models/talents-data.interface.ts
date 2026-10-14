import { TalentTree } from './talent-tree.interface';

export interface TalentsData {
  source: string;
  version: string;
  trees: TalentTree[];
}
