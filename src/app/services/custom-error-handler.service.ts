import { ErrorHandler, Injectable, NgZone } from '@angular/core';

@Injectable()
export class CustomErrorHandlerService implements ErrorHandler {
  constructor(private ngZone: NgZone) {}

  handleError(error: unknown): void {
    this.ngZone.run(() => {
      console.warn('Error occurred and captured at custom handler !', error);
    });
  }
}
