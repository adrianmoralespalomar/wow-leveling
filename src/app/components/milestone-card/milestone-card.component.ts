import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ACQUISITION_ROUTE_LABELS } from '../../models/acquisition-route-labels.const';
import { MILESTONE_KIND_LABELS } from '../../models/milestone-kind-labels.const';
import { MilestoneView } from '../../models/milestone-view.interface';
import { getAcquisitionRoute } from '../../utils/acquisition-route.utils';
import { describeItemBriefly } from '../../utils/item-description.utils';
import { ItemLinkComponent } from '../item-link/item-link.component';

@Component({
  selector: 'app-milestone-card',
  imports: [ItemLinkComponent],
  templateUrl: './milestone-card.component.html',
  styleUrl: './milestone-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.upcoming]': 'isUpcoming()' },
})
export class MilestoneCardComponent {
  readonly view = input.required<MilestoneView>();
  /** Hito que todavía no has alcanzado. */
  readonly isUpcoming = input(false);

  protected readonly kindLabels = MILESTONE_KIND_LABELS;
  protected readonly describeItemBriefly = describeItemBriefly;
  protected readonly getAcquisitionRoute = getAcquisitionRoute;
  protected readonly routeLabels = ACQUISITION_ROUTE_LABELS;
}
