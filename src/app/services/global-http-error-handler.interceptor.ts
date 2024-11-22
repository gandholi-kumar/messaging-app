import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { retry, timer, catchError, throwError } from 'rxjs';

export const globalHttpErrorHandlerInterceptor: HttpInterceptorFn = (
  req,
  next
) => {
  return next(req).pipe(
    retry({
      count: 3,
      delay: (_, retryCount) => timer(retryCount * 1000),
    }),
    catchError((err: HttpErrorResponse) => {
      console.log('Error handled at interceptor...');
      return throwError(() => {
        console.log('Error rethrow from Interceptor');
        return err;
      });
    })
  );
};
