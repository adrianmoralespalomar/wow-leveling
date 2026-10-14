import { Directive, ElementRef, inject, input } from '@angular/core';
import { TooltipContent } from '../../models/tooltip-content.type';
import { TooltipService } from '../../services/tooltip.service';

/** Muestra el tooltip del juego al pasar el ratón, al enfocar con teclado o al tocar en el móvil. */
@Directive({
  selector: '[appTooltip]',
  host: {
    '(pointerdown)': 'onPointerDown($event)',
    '(pointerenter)': 'onPointerEnter($event)',
    '(pointermove)': 'onPointerMove($event)',
    '(pointerleave)': 'onPointerLeave()',
    '(click)': 'onClicked($event)',
    '(focusin)': 'onFocusIn()',
    '(focusout)': 'onFocusOut()',
  },
})
export class TooltipDirective {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly tooltipService = inject(TooltipService);

  readonly content = input.required<TooltipContent | null>({ alias: 'appTooltip' });

  private lastPointerType = 'mouse';

  protected onPointerDown(event: PointerEvent): void {
    this.lastPointerType = event.pointerType;
  }

  protected onPointerEnter(event: PointerEvent): void {
    if (event.pointerType !== 'mouse') return;
    this.showAt(event.clientX, event.clientY);
  }

  protected onPointerMove(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && this.isShowingOwnContent()) this.tooltipService.move({ x: event.clientX, y: event.clientY });
  }

  protected onPointerLeave(): void {
    if (this.lastPointerType === 'mouse') this.tooltipService.hide();
  }

  // En pantallas táctiles el primer toque abre el tooltip y el segundo lo cierra
  protected onClicked(event: MouseEvent): void {
    if (this.lastPointerType === 'mouse') return;
    event.stopPropagation();
    if (this.isShowingOwnContent()) return this.tooltipService.hide();
    const bounds = this.elementRef.nativeElement.getBoundingClientRect();
    this.showAt(bounds.left, bounds.bottom);
  }

  protected onFocusIn(): void {
    if (!this.elementRef.nativeElement.matches(':focus-visible')) return;
    const bounds = this.elementRef.nativeElement.getBoundingClientRect();
    this.showAt(bounds.left, bounds.bottom);
  }

  protected onFocusOut(): void {
    if (this.isShowingOwnContent()) this.tooltipService.hide();
  }

  private showAt(x: number, y: number): void {
    const content = this.content();
    if (content) this.tooltipService.show(content, { x, y });
  }

  private isShowingOwnContent(): boolean {
    return this.tooltipService.content() === this.content();
  }
}
