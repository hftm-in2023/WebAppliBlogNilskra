import { Routes } from '@angular/router';
import { DemoComponent } from './features/demo/demo.component';
import { isAuthenticatedCanMatch } from './core/guards/authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/blog/blog.routes').then((m) => m.blogRoutes),
  },
  {
    path: 'detail/:id',
    loadChildren: () =>
      import('./features/blog-detail/blog-detail.routes').then(
        (m) => m.blogDetailRoutes,
      ),
  },
  {
    path: 'add',
    loadChildren: () =>
      import('./features/add-blog-page/add-blog.routes').then(
        (m) => m.addBlogRoutes,
      ),
  },
  { path: 'demo', component: DemoComponent },
];