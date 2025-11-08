import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { map, shareReplay } from 'rxjs/operators';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthStore } from '../auth/state';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatTooltip,
    MatIconModule,
    RouterOutlet,
    RouterModule,
    TranslatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly #authStore = inject(AuthStore);
  readonly #translate = inject(TranslateService);

  onModeChange($event: string) {
    console.log(`event fired ${$event}`);
  }

  isAuthenticated = this.#authStore.isAuthenticated;
  userData = this.#authStore.userData;
  roles = this.#authStore.roles;
  hasUserRole = this.#authStore.hasUserRole;

  login() {
    this.#authStore.login();
  }

  logout() {
    this.#authStore.logout();
  }

  private breakpointObserver = inject(BreakpointObserver);

  isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => result.matches),
      shareReplay(),
    ),
    { initialValue: false },
  ) as Signal<boolean>;

  changeLanguage(language: string) {
    this.#translate.use(language);
  }
}
