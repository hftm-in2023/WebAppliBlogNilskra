import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogDetailComponent } from './blog-detail.component';
import { RouterModule } from '@angular/router';
import { blogDetailRoutes } from './blog-detail.routes';

@NgModule({
  imports: [
    CommonModule,
    BlogDetailComponent,
    RouterModule.forChild(blogDetailRoutes),
  ],
})
export class BlogDetailModule {}
