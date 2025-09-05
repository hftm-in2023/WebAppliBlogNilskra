import { Injectable, computed, signal, inject } from '@angular/core';
import { Subject, of } from 'rxjs';
import { filter, switchMap, map, catchError, tap } from 'rxjs/operators';
import { BlogApi } from '../services/blog.api';
import { type BlogPreviewEntry, type BlogDetailEntry } from '../models';

/** ---- Actions ---- */
interface LoadBlogs {
  type: 'LOAD_BLOGS';
}
interface LoadBlogsSuccess {
  type: 'LOAD_BLOGS_SUCCESS';
  blogs: BlogPreviewEntry[];
}
interface LoadBlogsFailure {
  type: 'LOAD_BLOGS_FAILURE';
  error: string;
}

interface SelectBlog {
  type: 'SELECT_BLOG';
  id: number;
}
interface LoadBlogDetail {
  type: 'LOAD_BLOG_DETAIL';
  id: number;
}
interface LoadBlogDetailSuccess {
  type: 'LOAD_BLOG_DETAIL_SUCCESS';
  blog: BlogDetailEntry;
}
interface LoadBlogDetailFailure {
  type: 'LOAD_BLOG_DETAIL_FAILURE';
  error: string;
}

type Action =
  | LoadBlogs
  | LoadBlogsSuccess
  | LoadBlogsFailure
  | SelectBlog
  | LoadBlogDetail
  | LoadBlogDetailSuccess
  | LoadBlogDetailFailure;

/** ---- State ---- */
interface BlogState {
  blogs: BlogPreviewEntry[];
  selectedId: number | null;
  selected: BlogDetailEntry | null;
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  blogs: [],
  selectedId: null,
  selected: null,
  loading: false,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class BlogStore {
  private api = inject(BlogApi);

  /** Central state as signal */
  private _state = signal<BlogState>(initialState);

  /** Selectors */
  blogs = computed(() => this._state().blogs);
  loading = computed(() => this._state().loading);
  error = computed(() => this._state().error);
  selected = computed(() => this._state().selected);

  /** Action stream */
  private actions$ = new Subject<Action>();

  /** Dispatch */
  dispatch(action: Action) {
    this.actions$.next(action);
  }

  /** Reducer (pure) */
  private reduce(s: BlogState, a: Action): BlogState {
    switch (a.type) {
      case 'LOAD_BLOGS':
        return { ...s, loading: true, error: null };
      case 'LOAD_BLOGS_SUCCESS':
        return { ...s, loading: false, blogs: a.blogs };
      case 'LOAD_BLOGS_FAILURE':
        return { ...s, loading: false, error: a.error };

      case 'SELECT_BLOG':
        return {
          ...s,
          selectedId: a.id,
          selected: null,
          error: null,
          loading: true,
        };
      case 'LOAD_BLOG_DETAIL':
        return { ...s, loading: true, error: null };
      case 'LOAD_BLOG_DETAIL_SUCCESS':
        return { ...s, loading: false, selected: a.blog };
      case 'LOAD_BLOG_DETAIL_FAILURE':
        return { ...s, loading: false, error: a.error };

      default:
        return s;
    }
  }

  /** State-updater (subscribe to ALL actions) */
  private reduceSub = this.actions$.subscribe((a) => {
    this._state.update((s) => this.reduce(s, a));
  });

  /** Side Effects: LOAD_BLOGS */
  private loadBlogsFx = this.actions$
    .pipe(
      filter((a): a is LoadBlogs => a.type === 'LOAD_BLOGS'),
      switchMap(() =>
        this.api.getBlogs().pipe(
          map(
            (blogs) =>
              ({ type: 'LOAD_BLOGS_SUCCESS', blogs }) as LoadBlogsSuccess,
          ),
          catchError((e) =>
            of({
              type: 'LOAD_BLOGS_FAILURE',
              error: String(e),
            } as LoadBlogsFailure),
          ),
        ),
      ),
    )
    .subscribe((a) => this.dispatch(a));

  /** Side Effects: SELECT_BLOG -> LOAD_BLOG_DETAIL */
  private selectFx = this.actions$
    .pipe(
      filter((a): a is SelectBlog => a.type === 'SELECT_BLOG'),
      tap((a) => this.dispatch({ type: 'LOAD_BLOG_DETAIL', id: a.id })),
      switchMap((a) =>
        this.api.getBlogById(a.id).pipe(
          map(
            (blog) =>
              ({
                type: 'LOAD_BLOG_DETAIL_SUCCESS',
                blog,
              }) as LoadBlogDetailSuccess,
          ),
          catchError((e) =>
            of({
              type: 'LOAD_BLOG_DETAIL_FAILURE',
              error: String(e),
            } as LoadBlogDetailFailure),
          ),
        ),
      ),
    )
    .subscribe((a) => this.dispatch(a));

  /** Convenience APIs for Components */
  loadBlogs() {
    this.dispatch({ type: 'LOAD_BLOGS' });
  }
  selectBlog(id: number) {
    this.dispatch({ type: 'SELECT_BLOG', id });
  }
}