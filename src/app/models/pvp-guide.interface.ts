import { Battleground } from './battleground.interface';
import { GuideSource } from './guide-source.interface';
import { PvpBracket } from './pvp-bracket.interface';
import { PvpCombatTip } from './pvp-combat-tip.interface';
import { PvpPetPick } from './pvp-pet-pick.interface';

export interface PvpGuide {
  updatedAt: string;
  note: string;
  rules: string[];
  battlegrounds: Battleground[];
  brackets: PvpBracket[];
  combatTips: PvpCombatTip[];
  pets: PvpPetPick[];
  sources: GuideSource[];
}
