import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-add-blog-page',
    imports: [CommonModule],
    template: `
    <section class="add-blog-placeholder">
      <h1>Neuen Blogeintrag erstellen</h1>
      <p>Formular folgt ausserhalb dieses Scopes.</p>
    </section>
  `,
    styles: [
        `
      .add-blog-placeholder {
        padding: 2rem;
      }
    `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddBlogPageComponent {}
