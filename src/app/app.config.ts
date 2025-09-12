import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { correlationInterceptor } from './core/interceptors/correlation.interceptor';
import {
  provideAuth,
  StsConfigLoader,
  StsConfigStaticLoader,
  LogLevel,
  OidcSecurityService,
} from 'angular-auth-oidc-client';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([correlationInterceptor])),
    provideAuth({
      loader: {
        provide: StsConfigLoader,
        useFactory: () =>
          new StsConfigStaticLoader([
            {
              authority:
                'https://d-cap-keyclaok.kindbay-711f60b2.westeurope.azurecontainerapps.io/realms/blog',
              redirectUrl: window.location.origin,
              postLogoutRedirectUri: window.location.origin,
              clientId: 'spa-blog',
              scope: 'openid profile email offline_access',
              responseType: 'code',
              silentRenew: true,
              silentRenewUrl: window.location.origin + '/silent-renew.html',
              renewTimeBeforeTokenExpiresInSeconds: 10,
              secureRoutes: [
                'https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io',
              ],
              logLevel: LogLevel.Warn,
            },
          ]),
      },
    }),
    {
      provide: 'APP_BOOTSTRAP_LISTENER',
      multi: true,
      useFactory: (oidc: OidcSecurityService) => {
        return () => {
          oidc.checkAuth().subscribe({
            next: (res) => console.log('OIDC init', res),
            error: (err) => console.error('OIDC error', err),
          });
        };
      },
      deps: [OidcSecurityService],
    },
  ],
};