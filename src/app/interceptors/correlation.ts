import { HttpInterceptorFn } from '@angular/common/http';

export const correlationIdInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    setHeaders: { CorrelationId: `${Math.floor(Math.random() * 1000)}` },
  });
  return next(req);
};