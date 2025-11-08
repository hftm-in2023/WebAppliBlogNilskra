import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  BlogPreviewResponseSchema,
  BlogDetailEntrySchema,
  type BlogPreviewEntry,
  type BlogDetailEntry,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  blogEntries = signal<BlogPreviewEntry[]>([]);
  loading = signal(true);

  private apiUrl =
    'https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io/entries';

  private http = inject(HttpClient);

  /** Liste laden (/entries) */
  loadBlogs() {
    this.loading.set(true);
    this.http
      .get<unknown>(this.apiUrl)
      .pipe(
        map((res) => {
          const parsed = BlogPreviewResponseSchema.safeParse(res);
          if (!parsed.success) {
            console.error(
              '[Zod] Ungültige Antwort für /entries',
              parsed.error.format(),
            );
            throw new Error('Invalid blog list data');
          }
          return parsed.data.data;
        }),
      )
      .subscribe({
        next: (data) => {
          console.log('Empfangene Daten (valide):', data);
          this.blogEntries.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Fehler beim Laden:', err);
          this.loading.set(false);
        },
      });
  }

  /** Detailseite laden (/entries/:id) */
  getBlogById(id: number): Observable<BlogDetailEntry> {
    return this.http.get<unknown>(`${this.apiUrl}/${id}`).pipe(
      map((res) => {
        const parsed = BlogDetailEntrySchema.safeParse(res);
        if (!parsed.success) {
          console.error(
            '[Zod] Ungültige Antwort für /entries/:id',
            parsed.error.format(),
          );
          throw new Error('Invalid blog detail data');
        }
        return parsed.data;
      }),
    );
  }
}
