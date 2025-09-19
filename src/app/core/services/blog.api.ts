import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import {
  BlogPreviewResponseSchema,
  BlogDetailEntrySchema,
  type BlogPreviewEntry,
  type BlogDetailEntry,
} from '../../core/models';

@Injectable({ providedIn: 'root' })
export class BlogApi {
  private http = inject(HttpClient);

  private readonly base =
    'https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io/entries';

  getBlogs() {
    return this.http.get<unknown>(this.base).pipe(
      map((res) => {
        const parsed = BlogPreviewResponseSchema.safeParse(res);
        if (!parsed.success) throw new Error('[Zod] Invalid /entries');
        return parsed.data.data as BlogPreviewEntry[];
      }),
    );
  }

  getBlogById(id: number) {
    return this.http.get<unknown>(`${this.base}/${id}`).pipe(
      map((res) => {
        const parsed = BlogDetailEntrySchema.safeParse(res);
        if (!parsed.success) throw new Error('[Zod] Invalid /entries/:id');
        return parsed.data as BlogDetailEntry;
      }),
    );
  }
}