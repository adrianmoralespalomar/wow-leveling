import { Injectable, signal } from '@angular/core';
import { TooltipContent } from '../models/tooltip-content.type';
import { TooltipAnchor } from '../models/tooltip-anchor.interface';

/** Un único tooltip flotante para toda la app, como el del juego. */
@Injectable({ providedIn: 'root' })
export class TooltipService {
  readonly content = signal<TooltipContent | null>(null);
  readonly anchor = signal<TooltipAnchor>({ x: 0, y: 0 });

  show(content: TooltipContent, anchor: TooltipAnchor): void {
    this.content.set(content);
    this.anchor.set(anchor);
  }

  move(anchor: TooltipAnchor): void {
    this.anchor.set(anchor);
  }

  hide(): void {
    this.content.set(null);
  }
}
