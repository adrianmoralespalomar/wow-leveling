import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BetaNoticeComponent } from './components/beta-notice/beta-notice.component';
import { GameModeSwitchComponent } from './components/game-mode-switch/game-mode-switch.component';
import { LevelTrackComponent } from './components/level-track/level-track.component';
import { TooltipHostComponent } from './components/tooltip/tooltip-host.component';
import { NAVIGATION_LINKS } from './models/navigation-links.const';
import { GameDataService } from './services/game-data.service';

@Component({
  selector: 'app-root',
  imports: [
    BetaNoticeComponent,
    GameModeSwitchComponent,
    LevelTrackComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TooltipHostComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly gameData = inject(GameDataService);

  protected readonly navigationLinks = NAVIGATION_LINKS;
}
