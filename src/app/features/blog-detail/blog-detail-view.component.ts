import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { type BlogDetailEntry } from '../../core/models';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-blog-detail-view',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, TranslatePipe],
  templateUrl: './blog-detail-view.component.html',
  styleUrls: ['./blog-detail-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogDetailViewComponent {
  blog = input<BlogDetailEntry | null>(null);
  back = output<void>();
}
