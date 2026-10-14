import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';
import { ICON_URL_TEMPLATES } from '../../models/icon-url-templates.const';

/** Icono del juego; si un servidor no lo tiene, prueba el siguiente. */
@Component({
  selector: 'app-game-icon',
  templateUrl: './game-icon.component.html',
  styleUrl: './game-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"size-" + size()',
    '[attr.data-quality]': 'quality()',
  },
})
export class GameIconComponent {
  readonly icon = input.required<string>();
  readonly size = input<'small' | 'medium' | 'large'>('medium');
  readonly quality = input<number | null>(null);

  private readonly urlTemplateIndex = linkedSignal(() => {
    this.icon();
    return 0;
  });

  protected readonly iconUrl = computed(() =>
    ICON_URL_TEMPLATES[this.urlTemplateIndex()]?.replace('{icon}', this.icon().toLowerCase()) ?? null,
  );

  protected onIconLoadFailed(): void {
    this.urlTemplateIndex.update((index) => index + 1);
  }
}
