import { Routes } from '@angular/router';
import { isAuthenticatedCanMatch } from '../../core/guards/authenticated.guard';

export const addBlogRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./add-blog-page.component').then((m) => m.AddBlogPageComponent),
  },
];
