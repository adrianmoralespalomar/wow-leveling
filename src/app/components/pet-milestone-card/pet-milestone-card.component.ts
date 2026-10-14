import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PetMilestoneView } from '../../models/pet-milestone-view.interface';
import { BeastLinkComponent } from '../beast-link/beast-link.component';

@Component({
  selector: 'app-pet-milestone-card',
  imports: [BeastLinkComponent],
  templateUrl: './pet-milestone-card.component.html',
  styleUrl: './pet-milestone-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.upcoming]': 'isUpcoming()' },
})
export class PetMilestoneCardComponent {
  readonly view = input.required<PetMilestoneView>();
  /** Hito que todavía no has alcanzado. */
  readonly isUpcoming = input(false);
}
