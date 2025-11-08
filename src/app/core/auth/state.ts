import { computed, inject, Injectable } from '@angular/core';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { toSignal } from '@angular/core/rxjs-interop';
import { lastValueFrom } from 'rxjs';

const initialState = { isAuthenticated: false } as LoginResponse;

@Injectable({ providedIn: 'root' })
export class AuthStore {
  readonly #oidcSecurityService = inject(OidcSecurityService);

  readonly #authentication = toSignal(this.#oidcSecurityService.checkAuth(), {
    initialValue: initialState,
  });

  isAuthenticated = computed(() => this.#authentication().isAuthenticated);
  userData = computed(() => this.#authentication().userData);
  auth = computed(() => this.#authentication());
  token = computed(() => this.#authentication().accessToken);

  roles = computed(() => {
    const token = this.token();
    if (!token) return null;

    const decodedToken = JSON.parse(atob(token?.split('.')[1]));
    const roles: string[] = decodedToken?.realm_access?.roles || [];
    return roles;
  });

  hasUserRole = computed(() => {
    return this.roles()?.includes('user') ?? false;
  });

  login() {
    this.#oidcSecurityService.authorize();
  }

  logout() {
    return lastValueFrom(this.#oidcSecurityService.logoff());
  }
}
