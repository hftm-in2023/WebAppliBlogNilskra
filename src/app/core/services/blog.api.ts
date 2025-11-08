import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import {
  BlogPreviewResponseSchema,
  BlogDetailEntrySchema,
  type BlogPreviewEntry,
  type BlogDetailEntry,
} from '../../core/models';
import { z } from 'zod';
import { AuthStore } from '../auth';

const CreatedBlogSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(50),
});

export type CreatedBlog = z.infer<typeof CreatedBlogSchema>;

type TokenLike = string | { accessToken?: string; token?: string } | undefined;

function extractToken(raw: TokenLike): string {
  if (typeof raw === 'string') return raw.trim();
  if (raw && typeof raw === 'object') {
    const t = raw.accessToken ?? raw.token ?? '';
    return typeof t === 'string' ? t.trim() : '';
  }
  return '';
}

@Injectable({ providedIn: 'root' })
export class BlogApi {
  private http = inject(HttpClient);
  private auth = inject(AuthStore);

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

  createBlog(blog: CreatedBlog) {
    CreatedBlogSchema.parse(blog);

    const token = extractToken(this.auth.token());

    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    return this.http.post(`${this.base}`, blog, { headers });
  }
}
