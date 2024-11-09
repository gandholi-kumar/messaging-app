import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appHideAfter]',
  standalone: true
})
export class HideAfterDirective {
  @Input('appHideAfter')
  delay: number = 0;

  @Input('appHideAfterElse')
  defaultTemplate: TemplateRef<any> | null = null;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) { }

  /**
   * Hides the element after a specified delay.
   *
   * Uses `setTimeout` to schedule the hiding of the element.
   * If `appHideAfterElse` is provided, it will be rendered instead of the original element after the delay.
   * Otherwise, the original element will be removed.
   */
  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.templateRef);

    setTimeout(() => {
      this.viewContainerRef.clear();
      if (this.defaultTemplate) {
        this.viewContainerRef.createEmbeddedView(this.defaultTemplate);
      }
    }, this.delay);
  }
}
