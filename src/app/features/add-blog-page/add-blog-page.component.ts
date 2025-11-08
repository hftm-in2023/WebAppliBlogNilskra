import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddBlogFormComponent } from './add-blog-form.component';
import { BlogApi } from '../../core/services/blog.api';
import { BlogStore } from '../../core/state/blog.store';
import { map, of, switchMap, timer } from 'rxjs';

interface CreatedBlog {
  title: string;
  content: string;
}

@Component({
  selector: 'app-add-blog-page',
  standalone: true,
  imports: [AddBlogFormComponent],
  template: `
    <app-add-blog-form
      [form]="form"
      [errorText]="error()"
      [saving]="saving()"
      [submitDisabled]="submitButtonDisabled()"
      (submitForm)="onSubmit()"
      (resetForm)="onReset()"
    />
  `,
})
export class AddBlogPageComponent {
  private destroyRef = inject(DestroyRef);
  private blogApi = inject(BlogApi);
  private blogStore = inject(BlogStore);

  readonly saving = this.blogStore.saving;
  readonly error = this.blogStore.error;

  readonly submitButtonDisabled = signal<boolean>(false);

  readonly form = new FormGroup<{
    title: FormControl<string>;
    content: FormControl<string>;
  }>({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[A-Z].*'),
        this.noTestWordValidator,
      ],
      asyncValidators: [this.titleExistsValidator.bind(this)],
      updateOn: 'blur',
    }),
    content: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(50)],
    }),
  });

  noTestWordValidator(control: AbstractControl): ValidationErrors | null {
    const v = (control.value ?? '').toString().trim().toLowerCase();
    return v === 'test' ? { custom: true } : null;
  }

  titleExistsValidator(control: AbstractControl) {
    const value = (control.value ?? '').toString().trim();
    if (!value) return of(null);
    return timer(250).pipe(
      switchMap(() => this.blogApi.getBlogs()),
      map((list) =>
        list.some((e) => e.title?.trim().toLowerCase() === value.toLowerCase())
          ? { titleTaken: true }
          : null,
      ),
    );
  }

  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
    this.form.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitButtonDisabled.set(true);

    try {
      const payload = this.form.getRawValue() as CreatedBlog;
      await this.blogStore.createBlog(payload);
    } catch {
      this.submitButtonDisabled.set(false);
    }
  }

  onReset() {
    this.form.reset({ title: '', content: '' });
  }
}
