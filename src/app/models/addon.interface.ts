export interface Addon {
  name: string;
  category: string;
  essential: boolean;
  description: string;
  status: string;
  caveat: string | null;
  url: string;
}
