import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { z } from 'zod';
import { environment } from '../../enviroment';

const CreatedBlogSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export type CreatedBlog = z.infer<typeof CreatedBlogSchema>;

@Injectable({
  providedIn: 'root'
})
export class AddBlogService {
  private httpClient = inject(HttpClient);

  async addBlog(blog: CreatedBlog): Promise<any> {
    // Daten vor dem Senden validieren
    CreatedBlogSchema.parse(blog);

    // HTTP POST Request
    return lastValueFrom(
      this.httpClient.post(`${environment.serviceUrl}/entries`, blog)
    );
  }
}
