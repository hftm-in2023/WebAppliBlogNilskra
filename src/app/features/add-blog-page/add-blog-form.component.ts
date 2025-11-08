import {
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

type AddBlogFormGroup = FormGroup<{
  title: FormControl<string>;
  content: FormControl<string>;
}>;

@Component({
  selector: 'app-add-blog-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './add-blog-form.component.html',
  styleUrls: ['./add-blog-form.component.scss'],
})
export class AddBlogFormComponent {
  @Input({ required: true }) form!: AddBlogFormGroup;

  @Input() errorText?: string;

  @Input() saving = false;

  @Input() submitDisabled = false;

  @Output() submitForm = new EventEmitter<void>();
  @Output() resetForm = new EventEmitter<void>();

  onSubmit() {
    this.submitForm.emit();
  }
  onReset() {
    this.resetForm.emit();
  }

  get title() {
    return this.form.get('title');
  }
  get content() {
    return this.form.get('content');
  }

  readonly isInvalid = computed(() => this.form.invalid);
}
