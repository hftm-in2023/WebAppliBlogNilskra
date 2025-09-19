import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { combineLatest, map, take, tap } from 'rxjs';
import { KeycloakUserData } from '../auth/auth.models';

function hasRole(
  userData: KeycloakUserData | null | undefined,
  role: string,
  clientId?: string,
): boolean {
  if (!userData) return false;

  const realmRoles = userData.realm_access?.roles ?? [];
  if (realmRoles.includes(role)) return true;

  if (clientId) {
    const clientRoles = userData.resource_access?.[clientId]?.roles ?? [];
    if (clientRoles.includes(role)) return true;
  } else {
    const ra = userData.resource_access ?? {};
    for (const cid of Object.keys(ra)) {
      const roles = ra[cid]?.roles ?? [];
      if (roles.includes(role)) return true;
    }
  }
  return false;
}

export const isAuthenticatedCanMatch: CanMatchFn = () => {
  const oidc = inject(OidcSecurityService);
  const router = inject(Router);
  const clientId = 'spa-blog';

  return combineLatest([oidc.isAuthenticated$, oidc.userData$]).pipe(
    take(1),
    map(
      ([auth, user]) =>
        auth.isAuthenticated &&
        hasRole(user.userData as KeycloakUserData, 'user', clientId),
    ),
    tap((ok) => {
      if (!ok) {
        router.navigateByUrl('/');
      }
    }),
  );
};
