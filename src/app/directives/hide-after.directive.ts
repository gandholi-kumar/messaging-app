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
