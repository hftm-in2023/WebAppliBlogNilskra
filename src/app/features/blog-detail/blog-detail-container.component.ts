import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogDetailViewComponent } from './blog-detail-view.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BlogStore } from '../../core/state/blog.store';
import { Router } from '@angular/router';

@Component({
    selector: 'app-blog-detail-container',
    imports: [CommonModule, MatProgressSpinnerModule, BlogDetailViewComponent],
    template: `
    @if (store.loading()) {
      <div class="spinner-wrap">
        <mat-progress-spinner
          mode="indeterminate"
          diameter="40"
        ></mat-progress-spinner>
      </div>
    } @else {
      <app-blog-detail-view
        [blog]="store.selected()"
        (back)="router.navigate(['/'])"
      />
    }
  `,
    styles: [
        `
      .spinner-wrap {
        display: flex;
        justify-content: center;
        padding: 2rem;
      }
    `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogDetailContainerComponent {
  store = inject(BlogStore);
  router = inject(Router);
}
