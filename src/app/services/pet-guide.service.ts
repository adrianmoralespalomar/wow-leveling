import { computed, inject, Injectable } from '@angular/core';
import { ALL_PET_FAMILIES } from '../models/all-pet-families.const';
import { ALLIANCE_ZONES } from '../models/alliance-zones.const';
import { BEAST_MAP_URL_TEMPLATE } from '../models/beast-map-url.const';
import { BeastView } from '../models/beast-view.interface';
import { PetAbility } from '../models/pet-ability.interface';
import { PetAbilityProgress } from '../models/pet-ability-progress.interface';
import { PetAbilityRank } from '../models/pet-ability-rank.interface';
import { PetAbilityTeacher } from '../models/pet-ability-teacher.interface';
import { PetAbilityUnlock } from '../models/pet-ability-unlock.interface';
import { PetFamily } from '../models/pet-family.interface';
import { PetFamilyGuide } from '../models/pet-family-guide.interface';
import { PetFamilyView } from '../models/pet-family-view.interface';
import { PetMilestone } from '../models/pet-milestone.interface';
import { PetMilestoneView } from '../models/pet-milestone-view.interface';
import { TameableBeast } from '../models/tameable-beast.interface';
import { GameDataService } from './game-data.service';

// Una bestia más de 4 niveles por debajo del tuyo ya no compensa domarla
const NEARBY_LEVEL_RANGE = 4;
const RECOMMENDED_TIERS = ['top', 'good'];
const MAX_TEACHERS_SHOWN = 3;

/** Cruza la guía de mascotas curada con la lista de bestias domables de la beta. */
@Injectable({ providedIn: 'root' })
export class PetGuideService {
  private readonly gameData = inject(GameDataService);

  private readonly beastsById = computed(
    () => new Map<number, TameableBeast>(this.gameData.tameableBeasts().map((beast) => [beast.id, beast])),
  );
  private readonly familiesById = computed(
    () => new Map<number, PetFamily>(this.gameData.petFamilies().map((family) => [family.id, family])),
  );
  private readonly familyGuidesById = computed(
    () => new Map<number, PetFamilyGuide>((this.gameData.petGuide()?.families ?? []).map((guide) => [guide.id, guide])),
  );

  readonly rules = computed(() => this.gameData.petGuide()?.rules ?? []);
  readonly milestones = computed(() =>
    (this.gameData.petGuide()?.milestones ?? []).map((milestone) => this.toMilestoneView(milestone)),
  );

  readonly familyViews = computed<PetFamilyView[]>(() =>
    (this.gameData.petGuide()?.families ?? []).flatMap((guide) => {
      const family = this.familiesById().get(guide.id);
      if (!family) return [];
      const beastCount = this.gameData.tameableBeasts().filter((beast) => beast.familyId === guide.id).length;
      return [{ family, guide, beastCount }];
    }),
  );

  getCurrentMilestone(level: number): PetMilestoneView | null {
    return this.milestones().filter((view) => view.milestone.level <= level).at(-1) ?? null;
  }

  getNextMilestone(level: number): PetMilestoneView | null {
    return this.milestones().find((view) => view.milestone.level > level) ?? null;
  }

  getMilestonesBetween(fromLevel: number, toLevel: number): PetMilestoneView[] {
    return this.milestones().filter((view) => view.milestone.level >= fromLevel && view.milestone.level <= toLevel);
  }

  /** Bestias de familias recomendadas que ya puedes domar y que no se te han quedado bajas. */
  getNearbyBeasts(level: number, limit: number): BeastView[] {
    return this.gameData
      .tameableBeasts()
      .filter(
        (beast) =>
          beast.minLevel !== null &&
          beast.maxLevel !== null &&
          beast.minLevel <= level &&
          beast.maxLevel >= level - NEARBY_LEVEL_RANGE &&
          beast.zones.some((zone) => !ALLIANCE_ZONES.includes(zone)) &&
          RECOMMENDED_TIERS.includes(this.familyGuidesById().get(beast.familyId)?.tier ?? ''),
      )
      .sort((first, second) => Number(second.isRare) - Number(first.isRare) || (second.maxLevel ?? 0) - (first.maxLevel ?? 0))
      .slice(0, limit)
      .map((beast) => this.toBeastView(beast));
  }

  private toBeastView(beast: TameableBeast): BeastView {
    const family = this.familiesById().get(beast.familyId);
    const familyGuide = this.familyGuidesById().get(beast.familyId);
    const levelText =
      beast.minLevel === beast.maxLevel ? `nivel ${beast.minLevel ?? '?'}` : `nivel ${beast.minLevel}-${beast.maxLevel}`;
    return {
      beast,
      family,
      familyGuide,
      levelText,
      mapUrl: BEAST_MAP_URL_TEMPLATE.replace('{id}', String(beast.id)),
      tooltip: {
        kind: 'spell',
        name: beast.name,
        subtitle: beast.isRare ? 'Élite raro' : null,
        cost: `${family?.name ?? 'Bestia'}, ${levelText}, ${beast.zones.join(' / ')}`,
        description: familyGuide ? `${familyGuide.ability}: ${familyGuide.role}` : '',
        footer: 'Pulsa para ver dónde aparece en el mapa',
      },
    };
  }

  /** Rango más alto de cada habilidad que la familia puede aprender a ese nivel de mascota. */
  getAbilityProgress(familyName: string, level: number): PetAbilityProgress[] {
    return this.getFamilyAbilities(familyName).map((ability) => {
      const currentRank = ability.ranks.filter((rank) => rank.petLevel <= level).at(-1) ?? null;
      const nextRank = ability.ranks.find((rank) => rank.petLevel > level) ?? null;
      return this.toAbilityProgress(ability, currentRank, nextRank, level);
    });
  }

  private getFamilyAbilities(familyName: string): PetAbility[] {
    return this.gameData
      .petAbilities()
      .filter((ability) => ability.families.includes(ALL_PET_FAMILIES) || ability.families.includes(familyName));
  }

  private toAbilityProgress(
    ability: PetAbility,
    currentRank: PetAbilityRank | null,
    nextRank: PetAbilityRank | null,
    level: number,
  ): PetAbilityProgress {
    const hordeTeachers = (currentRank?.teachers ?? []).filter((teacher) => !ALLIANCE_ZONES.includes(teacher.zone));
    const teachersAtLevel = hordeTeachers
      .filter((teacher) => this.getTeacherMinLevel(teacher) <= level)
      .sort((first, second) => (second.maxLevel ?? 0) - (first.maxLevel ?? 0));
    // Si nadie lo enseña aún a tu nivel, las más cercanas por encima
    const areTeachersAboveLevel = !teachersAtLevel.length && hordeTeachers.length > 0;
    const teachers = (areTeachersAboveLevel
      ? [...hordeTeachers].sort((first, second) => this.getTeacherMinLevel(first) - this.getTeacherMinLevel(second))
      : teachersAtLevel
    )
      .slice(0, MAX_TEACHERS_SHOWN)
      .map((teacher) => this.toBeastView(this.beastsById().get(teacher.id) ?? this.toTameableBeast(teacher)));
    const teacherNames = teachers.map((teacher) => `${teacher.beast.name} (${teacher.beast.zones.join(', ')})`).join('; ');
    const howToLearn = ability.isFromTrainer
      ? 'Se aprende en el instructor de mascotas.'
      : areTeachersAboveLevel
        ? `Aún no puedes domar quien lo enseña. Desde el nivel ${teachers[0]?.beast.minLevel}: ${teacherNames}.`
        : teachers.length
          ? `Aprende el rango domando: ${teacherNames}.`
          : 'Ninguna bestia de la Horda lo enseña: mira Petopia.';
    return {
      ability,
      currentRank,
      nextRank,
      teachers,
      areTeachersAboveLevel,
      tooltip: {
        kind: 'spell',
        name: ability.name,
        subtitle: currentRank ? `Rango ${currentRank.rank}` : null,
        cost: currentRank ? `Nivel de mascota ${currentRank.petLevel}, ${currentRank.trainingPointCost} puntos de entrenamiento` : null,
        description: currentRank?.description ?? ability.description,
        footer: howToLearn,
      },
    };
  }

  private getTeacherMinLevel(teacher: PetAbilityTeacher): number {
    return teacher.minLevel ?? teacher.maxLevel ?? 0;
  }

  private toTameableBeast(teacher: PetAbilityTeacher): TameableBeast {
    const family = this.gameData.petFamilies().find((petFamily) => petFamily.name === teacher.family);
    return {
      id: teacher.id,
      name: teacher.name,
      familyId: family?.id ?? 0,
      minLevel: teacher.minLevel,
      maxLevel: teacher.maxLevel,
      zones: [teacher.isDungeon ? `${teacher.zone} (mazmorra)` : teacher.zone],
      isRare: false,
    };
  }

  /** Rangos que se desbloquean en el siguiente nivel de mascota con novedades (incluido el actual). */
  getUpcomingAbilityRanks(familyName: string, level: number): PetAbilityUnlock | null {
    const abilities = this.getFamilyAbilities(familyName);
    const unlockLevels = abilities.flatMap((ability) => ability.ranks.map((rank) => rank.petLevel)).filter((petLevel) => petLevel >= level);
    if (!unlockLevels.length) return null;
    const unlockLevel = Math.min(...unlockLevels);
    const entries = abilities.flatMap((ability) => {
      const rank = ability.ranks.find((abilityRank) => abilityRank.petLevel === unlockLevel);
      return rank ? [this.toAbilityProgress(ability, rank, null, unlockLevel)] : [];
    });
    return { level: unlockLevel, entries };
  }

  private toMilestoneView(milestone: PetMilestone): PetMilestoneView {
    const toViews = (beastIds: number[]): BeastView[] =>
      beastIds.flatMap((beastId) => {
        const beast = this.beastsById().get(beastId);
        return beast ? [this.toBeastView(beast)] : [];
      });
    return { milestone, beasts: toViews(milestone.beastIds), alternatives: toViews(milestone.alternativeBeastIds) };
  }
}
