import { Routes, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { of } from 'rxjs';

import { BlogComponent } from './blog.component';
import { BlogStore } from '../../core/state/blog.store';

export const blogListResolver: ResolveFn<boolean> = () => {
  const store = inject(BlogStore);

  if (store.blogs().length > 0) return of(true);

  store.loadBlogs();

  return of(true);
};

export const blogRoutes: Routes = [
  {
    path: '',
    component: BlogComponent,
    resolve: { ready: blogListResolver },
  },
];
