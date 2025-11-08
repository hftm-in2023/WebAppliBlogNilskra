import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthStore } from '../auth/state';
import { TranslateModule } from '@ngx-translate/core';

class AuthStoreMock {
  isAuthenticated = signal<boolean>(false);
  userData = signal<{ preferred_username: string } | undefined>(undefined);
  roles = signal<string[]>([]);
  hasUserRole = () => false;

  login = jasmine.createSpy('login');
  logout = jasmine.createSpy('logout');
}

const breakpointObserverMock = {
  observe: () => of({ matches: false }),
};

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let component: SidebarComponent;
  let auth: AuthStoreMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: BreakpointObserver, useValue: breakpointObserverMock },
        { provide: AuthStore, useClass: AuthStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    auth = TestBed.inject(AuthStore) as unknown as AuthStoreMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows "Login" in sidenav when not authenticated and calls login() on click', () => {
    const host: HTMLElement = fixture.nativeElement;
    // Suche alle List-Items (a oder button mit mat-list-item)
    const items = Array.from(
      host.querySelectorAll('[mat-list-item]'),
    ) as HTMLElement[];

    const loginItem = items.find((el) => el.textContent?.trim() === 'Login');
    expect(loginItem).toBeTruthy();

    loginItem!.click();
    expect(auth.login).toHaveBeenCalled();
  });
});
