export interface TameableBeast {
  id: number;
  name: string;
  familyId: number;
  minLevel: number | null;
  maxLevel: number | null;
  zones: string[];
  isRare: boolean;
}
