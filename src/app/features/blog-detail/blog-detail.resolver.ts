import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { BlogService, BlogDetailEntry } from '../../core/services/blog.service';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BlogDetailResolver implements Resolve<BlogDetailEntry> {
  private blogService = inject(BlogService);

  resolve(route: ActivatedRouteSnapshot): Observable<BlogDetailEntry> {
    return this.blogService.getBlogById(Number(route.paramMap.get('id')));
  }
}
