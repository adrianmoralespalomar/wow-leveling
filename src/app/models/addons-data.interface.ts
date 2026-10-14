import { Addon } from './addon.interface';

export interface AddonsData {
  updatedAt: string;
  warning: string;
  addons: Addon[];
}
