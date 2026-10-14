import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DATA_API_URLS } from '../models/data-api-urls.const';
import { DataCheckResult } from '../models/data-check-result.interface';
import { DataRefreshResult } from '../models/data-refresh-result.interface';
import { DataRefreshState } from '../models/data-refresh-state.type';
import { STORAGE_KEYS } from '../models/storage-keys.const';
import { setSessionFlag, takeSessionFlag } from '../utils/local-storage.utils';
import { GameDataService } from './game-data.service';

/**
 * Comprueba si las fuentes tienen datos nuevos y los regenera con el servidor local (scripts/data-server.mjs).
 * Sin ese servidor (web publicada o arrancada con ng serve a secas) solo se puede volver a cargar lo que hay en public/data.
 */
@Injectable({ providedIn: 'root' })
export class DataRefreshService {
  private readonly gameData = inject(GameDataService);
  private readonly http = inject(HttpClient);

  readonly state = signal<DataRefreshState>('idle');
  readonly message = signal<string | null>(null);
  readonly checkResult = signal<DataCheckResult | null>(null);
  /** ng serve recarga la página al cambiar public/data: el resultado se enseña al volver. */
  readonly hasResultAfterReload = signal(false);

  constructor() {
    if (!takeSessionFlag(STORAGE_KEYS.PENDING_DATA_REFRESH)) return;
    this.hasResultAfterReload.set(true);
    this.state.set('done');
    this.message.set('Datos actualizados: la página se ha recargado con la información nueva.');
  }

  async checkForUpdates(): Promise<void> {
    this.state.set('checking');
    this.message.set(null);
    try {
      const result = await firstValueFrom(this.http.get<DataCheckResult>(DATA_API_URLS.CHECK));
      this.checkResult.set(result);
      this.state.set('idle');
      this.message.set(
        result.hasUpdates
          ? `Hay datos nuevos: cliente ${result.remote.itemsBuild} (${result.remote.itemsBuildDate}). Pulsa Refrescar datos.`
          : 'Tus datos están al día con las fuentes.',
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async refreshData(): Promise<void> {
    this.state.set('refreshing');
    this.message.set('Descargando los datos de las fuentes. Tarda unos segundos…');
    setSessionFlag(STORAGE_KEYS.PENDING_DATA_REFRESH);
    try {
      const result = await firstValueFrom(this.http.post<DataRefreshResult>(DATA_API_URLS.REFRESH, {}));
      this.gameData.reloadData();
      this.checkResult.set(null);
      this.state.set('done');
      this.message.set(`Datos actualizados: cliente ${result.meta?.itemsBuild ?? '?'}.`);
    } catch (error) {
      this.handleError(error);
    }
  }

  /** Sin servidor de datos solo recarga los JSON tal como estén en public/data. */
  reloadLocalData(): void {
    this.gameData.reloadData();
    this.state.set('done');
    this.message.set('Se han vuelto a cargar los datos de public/data.');
  }

  private handleError(error: unknown): void {
    takeSessionFlag(STORAGE_KEYS.PENDING_DATA_REFRESH);
    const serverOutput = error instanceof HttpErrorResponse ? (error.error as Partial<DataRefreshResult> | null)?.output : null;
    if (serverOutput) {
      this.state.set('error');
      return this.message.set(`No se ha podido actualizar: ${serverOutput}`);
    }
    this.state.set('unavailable');
    this.message.set(
      'El refresco automático solo funciona arrancando la web en local con npm start. Si no, ejecuta npm run data y pulsa Volver a cargar.',
    );
  }
}
