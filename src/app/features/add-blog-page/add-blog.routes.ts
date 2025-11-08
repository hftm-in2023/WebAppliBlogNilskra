import { inject } from '@angular/core';
import { CanActivateFn, Routes } from '@angular/router';
import { AuthStore } from '../../core/auth';

const authGuard: CanActivateFn = async () => {
  const authStore = inject(AuthStore);
  const roles = await authStore.roles();
  console.log('User Roles from Auth Guard', roles);
  return authStore.isAuthenticated() && roles?.includes('user')
    ? true
    : (authStore.login(), false);
};

export const addBlogRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./add-blog-page.component').then((m) => m.AddBlogPageComponent),
    canActivate: [authGuard],
  },
];
