import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BlogStore } from '../../core/state/state';
import { CreatedBlog } from '../../core/services/add-blog.service';

@Component({
  selector: 'app-add-blog-page',
  imports: [
    FormsModule,           // Grundlegende Formular-Funktionalität
    ReactiveFormsModule,   // Reactive Forms-Direktiven
    MatFormFieldModule,    // Material Form Fields
    MatInputModule,        // Material Input-Komponenten
    MatButtonModule,       // Material Buttons
  ],
  template: `
    <section class="add-blog-placeholder">
      <h1>Neuen Blogeintrag erstellen</h1>
      <form [formGroup]="formTyped" (ngSubmit)="onSubmit()">
    <div class="blog-input">
        <mat-form-field appearance="fill">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title">
            <mat-error>
                @if (formTyped.get('title')?.hasError('custom')) {
                <span>Custom error: Title cannot be 'Test'</span>
                } @else if (formTyped.get('title')?.hasError('customAsync')) {
                <span>Custom async error: Title cannot be 'Test Async'</span>
                }
            </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
            <mat-label>Tell your story...</mat-label>
            <textarea matInput rows="20" formControlName="content"></textarea>
            <mat-error>
                @if (formTyped.get('content')?.hasError('required')) {
                <span>Content is required</span>
                } @else if (formTyped.get('content')?.hasError('minlength')) {
                <span>Content must be at least 50 characters long</span>
                }
            </mat-error>
        </mat-form-field>

        <button type="submit" class="submit-button" mat-raised-button [disabled]="formTyped.invalid" color="primary">
            Publish blog
        </button>

        <button type="reset" mat-raised-button color="secondary">
            Reset
        </button>
    </div>
</form>
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
export class AddBlogPageComponent {
  private blogStore = inject(BlogStore);

  // State für Template verfügbar machen
  protected state = this.blogStore.state;

  destroyRef = inject(DestroyRef);
  submitButtonDisabled = signal<boolean>(false);

  constructor() {
    // Auf Wertänderungen reagieren
    this.formTyped.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        console.log('Form value changed:', value);
        // Hier kannst du auf Änderungen reagieren
      });

    // Auf Status-Änderungen reagieren
    this.formTyped.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((status) => {
        console.log('Form status changed:', status);
        // Status: VALID, INVALID, PENDING, DISABLED
      });
  }


  formTyped = new FormGroup<{
    title: FormControl<string>;
    content: FormControl<string>;
  }>({
    title: new FormControl<string>('an exciting title', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[A-Z].*'),
        this.customValidator,
      ],
      asyncValidators: [this.customAsyncValidator],
    }),
    content: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(50),
      ],
      asyncValidators: [],
    }),
  });

  async onSubmit() {
    if (this.formTyped.valid) {
      this.submitButtonDisabled.set(true);

      try {
        const blogData = this.formTyped.value;
        console.log('Blog submitted:', blogData);

        await this.blogStore.addBlog(blogData as CreatedBlog);

      } catch (error) {
        console.error('Error submitting blog:', error);
        this.submitButtonDisabled.set(false);
      }
    } else {
      console.log('Form is invalid');
    }
  }

  customValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && value.toLowerCase() === 'test') {
      return { custom: true };
    }
    return null;
  }

  customAsyncValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise((resolve) => {
      // Simuliere Server-Anfrage mit Verzögerung
      setTimeout(() => {
        if (control.value === 'Test Async') {
          resolve({ customAsync: true });
        } else {
          resolve(null);
        }
      }, 1000); // 1 Sekunde Verzögerung
    });
  }

}
