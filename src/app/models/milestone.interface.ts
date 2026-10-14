import { MilestoneKind } from './milestone-kind.type';

export interface Milestone {
  level: number;
  kind: MilestoneKind;
  title: string;
  description: string;
  itemIds: number[];
  alternativeItemIds: number[];
}
