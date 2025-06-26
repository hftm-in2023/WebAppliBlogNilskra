import { Component, inject, OnInit } from '@angular/core';
import { BlogService } from '../../core/services/blog.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit {
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