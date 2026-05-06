import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { BackendStatusService } from './backend-status.service';

export const backendStatusInterceptor: HttpInterceptorFn = (req, next) => {
  const status = inject(BackendStatusService);

  if (!req.url.startsWith('/api') || req.url.includes('/api/health')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 0 || err.status === 502 || err.status === 503 || err.status === 504) {
          status.notifyPossibleWarmup();
        }
      }
      return throwError(() => err);
    })
  );
};
