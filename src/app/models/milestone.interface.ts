import { MilestoneKind } from './milestone-kind.type';

export interface Milestone {
  level: number;
  kind: MilestoneKind;
  title: string;
  description: string;
  itemIds: number[];
  /** Otras formas de cubrir el hito: misión, subasta, campo de batalla... */
  alternativeItemIds: number[];
  /** Qué hacer con el oro y el tiempo: si compensa comprar, esperar o saltarse la mazmorra. */
  advice?: string;
}
