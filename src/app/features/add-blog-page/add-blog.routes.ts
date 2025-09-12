import { Routes } from '@angular/router';
import { isAuthenticatedCanMatch } from '../../core/guards/authenticated.guard';

export const addBlogRoutes: Routes = [
  {
    path: '',
    canActivate: [isAuthenticatedCanMatch],
    loadComponent: () =>
      import('./add-blog-page.component').then((m) => m.AddBlogPageComponent),
  },
];
