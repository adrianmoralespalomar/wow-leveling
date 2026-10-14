import { Addon } from './addon.interface';

export interface AddonGroup {
  category: string;
  addons: Addon[];
}
