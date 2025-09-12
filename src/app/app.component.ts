import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { KeycloakUserData } from './core/auth/auth.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title: string | undefined;
  private oidc = inject(OidcSecurityService);

  isAuthenticated$ = this.oidc.isAuthenticated$;
  userData$ = this.oidc.userData$;

  ngOnInit(): void {
    this.oidc.checkAuth().subscribe({
      next: ({ isAuthenticated, userData }) => {
        console.log('Auth?', isAuthenticated, userData);
      },
      error: (err) => console.error('checkAuth error', err),
    });
  }

  login() {
    this.oidc.authorize();
  }

  logout() {
    this.oidc.logoff().subscribe();
  }

  roleIsUser(
    userData: KeycloakUserData | null | undefined,
    clientId?: string,
  ): boolean {
    if (!userData) return false;

    const realmRoles = userData.realm_access?.roles ?? [];
    if (realmRoles.includes('user')) return true;

    if (clientId) {
      const clientRoles = userData.resource_access?.[clientId]?.roles ?? [];
      if (clientRoles.includes('user')) return true;
    } else {
      const ra = userData.resource_access ?? {};
      for (const cid of Object.keys(ra)) {
        const roles = ra[cid]?.roles ?? [];
        if (roles.includes('user')) return true;
      }
    }
    return false;
  }

  username(userData: KeycloakUserData | null | undefined): string {
    if (!userData) return 'User';
    return (
      userData.preferred_username ?? userData.name ?? userData.email ?? 'User'
    );
  }
}