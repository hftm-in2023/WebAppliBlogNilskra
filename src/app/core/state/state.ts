import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AddBlogService, CreatedBlog } from '../services/add-blog.service';
import { RouterStore } from './router';

type BlogState = {
  error?: string;
};

@Injectable({
  providedIn: 'root',
})
export class BlogStore {
  #state = signal<BlogState>(
    { error: undefined },
    { debugName: 'BlogStateService:#state' },
  );
  state = this.#state.asReadonly();

  private blogService = inject(AddBlogService);
  private router = inject(Router);
  private loadingState = inject(RouterStore);

  async addBlog(blog: CreatedBlog) {
    this.#state.set({ error: undefined });

    try {
      this.loadingState.setLoadingState(true);
      await this.blogService.addBlog(blog);
      this.router.navigate(['/overview']);
    } catch (error) {
      this.loadingState.setLoadingState(false);
      this.#state.update((state) => ({
        ...state,
        error: (error as Error).message,
      }));
    }
  }
}