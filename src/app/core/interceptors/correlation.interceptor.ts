import { HttpInterceptorFn } from '@angular/common/http';

const BACKEND_BASE =
  'https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io';
const AUTH_BASE =
  'https://d-cap-keyclaok.kindbay-711f60b2.westeurope.azurecontainerapps.io';

function genCorrelationId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof (crypto as Crypto).randomUUID === 'function'
  ) {
    return (crypto as Crypto).randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const correlationInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method === 'OPTIONS') {
    return next(req);
  }

  const isAuthReq =
    req.url.startsWith(AUTH_BASE) ||
    req.url.includes('/.well-known/openid-configuration');

  if (isAuthReq) {
    return next(req);
  }

  const isBackendReq = req.url.startsWith(BACKEND_BASE);
  if (!isBackendReq) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: { 'x-correlation-id': genCorrelationId() },
  });
  return next(cloned);
};
