import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
  standalone: true,
  imports: [],
})
export class BlogDetailComponent {
  private route = inject(ActivatedRoute);
  blog = this.route.snapshot.data['blog'];
}
