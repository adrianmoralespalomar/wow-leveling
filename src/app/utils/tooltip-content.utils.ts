import { Ability } from '../models/ability.interface';
import { SpellTooltipContent } from '../models/spell-tooltip-content.interface';
import { Talent } from '../models/talent.interface';

/** Tooltip de un talento mostrando el rango indicado (1 si aún no tiene puntos). */
export function toTalentTooltip(talent: Talent, rank: number, footer: string | null = null): SpellTooltipContent {
  const shownRank = Math.max(1, Math.min(rank, talent.maxRank));
  return {
    kind: 'spell',
    name: talent.name,
    subtitle: `Rango ${rank}/${talent.maxRank}`,
    cost: talent.cost,
    description: talent.ranks[shownRank - 1] ?? '',
    footer,
  };
}

export function toAbilityTooltip(ability: Ability): SpellTooltipContent {
  return {
    kind: 'spell',
    name: ability.name,
    subtitle: ability.rank ? `Rango ${ability.rank}` : null,
    cost: ability.cost || null,
    description: ability.description,
    footer: ability.status === 'new' ? 'Nuevo en Forever' : null,
  };
}
