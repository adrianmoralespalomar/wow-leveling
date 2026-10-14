import { httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { AbilitiesData } from '../models/abilities-data.interface';
import { AddonsData } from '../models/addons-data.interface';
import { DataMeta } from '../models/data-meta.interface';
import { Item } from '../models/item.interface';
import { ItemsData } from '../models/items-data.interface';
import { LevelingGuide } from '../models/leveling-guide.interface';
import { PetAbilitiesData } from '../models/pet-abilities-data.interface';
import { PetGuide } from '../models/pet-guide.interface';
import { PetsData } from '../models/pets-data.interface';
import { Talent } from '../models/talent.interface';
import { TalentBuildsData } from '../models/talent-builds-data.interface';
import { TalentsData } from '../models/talents-data.interface';

/** Carga los JSON de public/data (generados con npm run data o editados a mano). */
@Injectable({ providedIn: 'root' })
export class GameDataService {
  /** Cambia al refrescar los datos para que los JSON se vuelvan a pedir sin caché. */
  private readonly dataVersion = signal(Date.now());

  private readonly abilitiesResource = httpResource<AbilitiesData>(() => this.toDataUrl('abilities.json'));
  private readonly addonsResource = httpResource<AddonsData>(() => this.toDataUrl('addons.json'));
  private readonly itemsResource = httpResource<ItemsData>(() => this.toDataUrl('items.json'));
  private readonly levelingGuideResource = httpResource<LevelingGuide>(() => this.toDataUrl('leveling-guide.json'));
  private readonly metaResource = httpResource<DataMeta>(() => this.toDataUrl('meta.json'));
  private readonly petAbilitiesResource = httpResource<PetAbilitiesData>(() => this.toDataUrl('pet-abilities.json'));
  private readonly petGuideResource = httpResource<PetGuide>(() => this.toDataUrl('pet-guide.json'));
  private readonly petsResource = httpResource<PetsData>(() => this.toDataUrl('pets.json'));
  private readonly talentBuildsResource = httpResource<TalentBuildsData>(() => this.toDataUrl('talent-builds.json'));
  private readonly talentsResource = httpResource<TalentsData>(() => this.toDataUrl('talents.json'));

  readonly abilities = computed(() => this.abilitiesResource.value()?.abilities ?? []);
  readonly addonsData = computed(() => this.addonsResource.value() ?? null);
  readonly items = computed(() => this.itemsResource.value()?.items ?? []);
  readonly itemsBuild = computed(() => this.itemsResource.value()?.build ?? null);
  readonly levelingGuide = computed(() => this.levelingGuideResource.value() ?? null);
  readonly meta = computed(() => this.metaResource.value() ?? null);
  readonly petAbilities = computed(() => this.petAbilitiesResource.value()?.abilities ?? []);
  readonly petGuide = computed(() => this.petGuideResource.value() ?? null);
  readonly petFamilies = computed(() => this.petsResource.value()?.families ?? []);
  readonly tameableBeasts = computed(() => this.petsResource.value()?.beasts ?? []);
  readonly talentBuilds = computed(() => this.talentBuildsResource.value()?.builds ?? []);
  readonly talentTrees = computed(() => this.talentsResource.value()?.trees ?? []);
  readonly talentsVersion = computed(() => this.talentsResource.value()?.version ?? null);

  readonly itemsById = computed(() => new Map<number, Item>(this.items().map((item) => [item.id, item])));
  readonly talentsById = computed(
    () => new Map<string, Talent>(this.talentTrees().flatMap((tree) => tree.talents.map((talent) => [talent.id, talent]))),
  );

  readonly isLoadingItems = computed(() => this.itemsResource.isLoading());
  readonly hasLoadError = computed(() =>
    [
      this.abilitiesResource,
      this.addonsResource,
      this.itemsResource,
      this.levelingGuideResource,
      this.petAbilitiesResource,
      this.petGuideResource,
      this.petsResource,
      this.talentBuildsResource,
      this.talentsResource,
    ].some((resource) => resource.error() !== undefined),
  );

  /** Vuelve a descargar todos los JSON (tras regenerarlos o editarlos). */
  reloadData(): void {
    this.dataVersion.set(Date.now());
  }

  private toDataUrl(fileName: string): string {
    return `data/${fileName}?v=${this.dataVersion()}`;
  }
}
