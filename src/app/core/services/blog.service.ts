import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

export interface BlogPreviewEntry {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  contentPreview: string;
  author: string;
  likes: number;
  comments: number;
  headerImageUrl: string;
}

export interface BlogDetailEntry {
  id: number;
  title: string;
  content: string;
  author: string;
  likes: number;
  comments: {
    id: number;
    content: string;
    author: string;
    createdAt: string;
    updatedAt: string;
  }[];
  headerImageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  blogEntries = signal<BlogPreviewEntry[]>([]);
  loading = signal(true);

  private apiUrl =
    'https://d-cap-blog-backend---v2.whitepond-b96fee4b.westeurope.azurecontainerapps.io/entries';

  private http = inject(HttpClient);

  loadBlogs() {
    this.loading.set(true);
    this.http.get<{ data: BlogPreviewEntry[] }>(this.apiUrl).subscribe({
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

  getBlogById(id: number): Observable<BlogDetailEntry> {
    return this.http.get<BlogDetailEntry>(`${this.apiUrl}/${id}`);
  }
}
