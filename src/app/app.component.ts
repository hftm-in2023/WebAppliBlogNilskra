import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService } from './services/blog.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>BlogFrog Übersicht</h1>

    @if (blogService.loading()) {
      <p>Lade Daten...</p>
    } @else {
      <div class="blog-container">
        @for (blog of blogs; track blog.id) {
          <article class="blog-entry">
            <img
              [src]="
                blog.headerImageUrl && blog.headerImageUrl !== 'string'
                  ? blog.headerImageUrl
                  : 'assets/images/platzhalter.png'
              "
              alt="Header Image"
            />
            <h2>{{ blog.title }}</h2>
            <p>{{ blog.contentPreview }}</p>
          </article>
        } @empty {
          <p>Keine Blogeinträge vorhanden.</p>
        }
      </div>
    }
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  blogService = inject(BlogService);
  title = 'angular-blogify-tobias-ragosa';

  ngOnInit() {
    this.blogService.loadBlogs();
  }

  get blogs() {
    return this.blogService.blogEntries();
  }

  get isLoading() {
    return this.blogService.loading();
  }
}
