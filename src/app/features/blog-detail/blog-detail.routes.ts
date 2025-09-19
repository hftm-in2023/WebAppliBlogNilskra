import { Routes, ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { BlogDetailContainerComponent } from './blog-detail-container.component';
import { BlogStore } from '../../core/state/blog.store';

export const blogDetailResolver: ResolveFn<boolean> = (route) => {
  const store = inject(BlogStore);
  const idParam = route.paramMap.get('id');
  const id = idParam ? Number(idParam) : NaN;
  if (isNaN(id)) throw new Error('Ungültige Blog-ID in der URL');

  store.selectBlog(id);

  return of(true);
};

export const blogDetailRoutes: Routes = [
  {
    path: '',
    component: BlogDetailContainerComponent,
    resolve: { ready: blogDetailResolver },
  },
];
