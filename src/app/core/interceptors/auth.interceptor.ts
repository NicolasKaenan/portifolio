import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

const API_HOST = 'api.kaenan.dev';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const header = auth.authHeader();

  if (!header || !req.url.includes(API_HOST)) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: header },
    })
  );
};
