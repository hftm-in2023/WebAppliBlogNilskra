import { Routes } from '@angular/router';
import { BlogComponent } from './features/blog/blog.component';
import { DemoComponent } from './features/demo/demo.component';

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
  { path: 'demo', component: DemoComponent },
];