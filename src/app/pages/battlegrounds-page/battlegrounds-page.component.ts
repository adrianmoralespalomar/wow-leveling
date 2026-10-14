import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameIconComponent } from '../../components/game-icon/game-icon.component';
import { PvpBracketCardComponent } from '../../components/pvp-bracket-card/pvp-bracket-card.component';
import { Battleground } from '../../models/battleground.interface';
import { PlayerProgressService } from '../../services/player-progress.service';
import { PvpGuideService } from '../../services/pvp-guide.service';

@Component({
  selector: 'app-battlegrounds-page',
  imports: [GameIconComponent, PvpBracketCardComponent, RouterLink],
  templateUrl: './battlegrounds-page.component.html',
  styleUrl: './battlegrounds-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BattlegroundsPageComponent {
  protected readonly playerProgress = inject(PlayerProgressService);
  private readonly pvpGuide = inject(PvpGuideService);

  protected readonly guide = this.pvpGuide.guide;
  protected readonly level = this.playerProgress.level;
  protected readonly currentBracket = computed(() => this.pvpGuide.getBracket(this.level()));
  protected readonly otherBrackets = computed(() =>
    this.pvpGuide.brackets().filter((view) => view.bracket !== this.currentBracket()?.bracket),
  );
  protected readonly petPicks = this.pvpGuide.petPicks;

  protected onPvpModeButtonClicked(): void {
    this.playerProgress.gameMode.set('pvp');
  }

  protected isOpenAtLevel(battleground: Battleground): boolean {
    return battleground.minLevel <= this.level() && this.level() <= battleground.maxLevel;
  }
}
