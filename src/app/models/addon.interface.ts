import { AddonMode } from './addon-mode.type';

export interface Addon {
  name: string;
  category: string;
  mode: AddonMode;
  essential: boolean;
  description: string;
  status: string;
  caveat: string | null;
  url: string;
}
