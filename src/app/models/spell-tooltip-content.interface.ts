export interface SpellTooltipContent {
  kind: 'spell';
  name: string;
  subtitle: string | null;
  cost: string | null;
  description: string;
  footer: string | null;
}
