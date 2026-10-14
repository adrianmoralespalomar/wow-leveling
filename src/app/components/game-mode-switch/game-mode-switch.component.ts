import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GameMode } from '../../models/game-mode.type';
import { GAME_MODE_LABELS } from '../../models/game-mode-labels.const';
import { GAME_MODES } from '../../models/game-modes.const';
import { PlayerProgressService } from '../../services/player-progress.service';

/** Cambia entre subir de nivel (PvE) y campos de batalla (PvP): talentos, pesos del equipo y addons dependen de ello. */
@Component({
  selector: 'app-game-mode-switch',
  templateUrl: './game-mode-switch.component.html',
  styleUrl: './game-mode-switch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameModeSwitchComponent {
  protected readonly playerProgress = inject(PlayerProgressService);

  protected readonly gameModes = GAME_MODES;
  protected readonly gameModeLabels = GAME_MODE_LABELS;

  protected onGameModeSelected(gameMode: GameMode): void {
    this.playerProgress.gameMode.set(gameMode);
  }
}
