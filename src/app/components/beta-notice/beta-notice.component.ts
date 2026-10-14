import { DatePipe } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { DataRefreshService } from '../../services/data-refresh.service';
import { GameDataService } from '../../services/game-data.service';

/** Aviso siempre visible de que los datos salen de la beta (nivel máximo 30), con el refresco de datos. */
@Component({
  selector: 'app-beta-notice',
  imports: [DatePipe],
  templateUrl: './beta-notice.component.html',
  styleUrl: './beta-notice.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetaNoticeComponent {
  protected readonly dataRefresh = inject(DataRefreshService);
  protected readonly gameData = inject(GameDataService);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    afterNextRender(() => {
      if (this.dataRefresh.hasResultAfterReload()) this.dialog().nativeElement.showModal();
    });
  }

  protected onBetaNoticeButtonClicked(): void {
    this.dialog().nativeElement.showModal();
  }

  protected onCloseDialogButtonClicked(): void {
    this.dialog().nativeElement.close();
  }

  protected onCheckUpdatesButtonClicked(): void {
    void this.dataRefresh.checkForUpdates();
  }

  protected onRefreshDataButtonClicked(): void {
    void this.dataRefresh.refreshData();
  }

  protected onReloadLocalDataButtonClicked(): void {
    this.dataRefresh.reloadLocalData();
  }
}
