import { NgModule } from '@angular/core';
import { BlogComponent } from './blog.component';
import { RouterModule } from '@angular/router';
import { blogRoutes } from './blog.routes';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, BlogComponent, RouterModule.forChild(blogRoutes)],
})
export class BlogModule {}
