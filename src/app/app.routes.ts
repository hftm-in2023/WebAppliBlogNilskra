import { Routes } from '@angular/router';
import { BlogComponent } from './features/blog/blog.component';
import { DemoComponent } from './features/demo/demo.component';

export const routes: Routes = [
  { path: '', component: BlogComponent },
  { path: 'demo', component: DemoComponent },
];