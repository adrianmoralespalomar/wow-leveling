import { FIRST_TALENT_LEVEL } from '../models/level-limits.const';
import { TalentBuild } from '../models/talent-build.interface';

export function getTalentIdForLevel(build: TalentBuild, level: number): string | null {
  return build.points[level - FIRST_TALENT_LEVEL] ?? null;
}

/** Rangos que tiene cada talento al llegar a ese nivel siguiendo la build. */
export function getTalentRanksAtLevel(build: TalentBuild, level: number): Record<string, number> {
  const spentPoints = build.points.slice(0, Math.max(0, level - FIRST_TALENT_LEVEL + 1));
  return spentPoints.reduce<Record<string, number>>((ranks, talentId) => {
    ranks[talentId] = (ranks[talentId] ?? 0) + 1;
    return ranks;
  }, {});
}

/** Primer nivel en que la build pone un punto en ese talento. */
export function getTalentLearnLevel(build: TalentBuild, talentId: string): number | null {
  const pointIndex = build.points.indexOf(talentId);
  return pointIndex === -1 ? null : pointIndex + FIRST_TALENT_LEVEL;
}

export function getTreeIndex(talentId: string): number {
  return Number(talentId.split('-')[0]);
}
