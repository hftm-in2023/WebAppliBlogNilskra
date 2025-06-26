import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

export interface BlogEntry {
  id: number;
  title: string;
  contentPreview: string;
  headerImageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  blogEntries = signal<BlogEntry[]>([]);
  loading = signal(true);

  private apiUrl =
    'https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io/entries';

  private http = inject(HttpClient);

  loadBlogs() {
    this.loading.set(true);
    this.http.get<{ data: BlogEntry[] }>(this.apiUrl).subscribe({
      next: (res) => {
        console.log('Empfangene Daten:', res.data);
        this.blogEntries.set(res.data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Fehler beim Laden:', err);
        this.loading.set(false);
      },
    });
  }
}