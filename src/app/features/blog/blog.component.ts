import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BlogStore } from '../../core/state/blog.store';

@Component({
    selector: 'app-blog',
    imports: [CommonModule, RouterModule, MatProgressSpinnerModule],
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogComponent {
  store = inject(BlogStore);

  get blogs() {
    return this.store.blogs();
  }
  get isLoading() {
    return this.store.loading();
  }
}
