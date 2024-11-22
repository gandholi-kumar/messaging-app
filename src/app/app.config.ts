import {
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { CustomErrorHandlerService } from './services/custom-error-handler.service';
import { globalHttpErrorHandlerInterceptor } from './services/global-http-error-handler.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(
      withInterceptors([globalHttpErrorHandlerInterceptor]),
    ),
    provideRouter(routes),
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandlerService,
    },
  ],
};
