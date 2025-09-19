import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-demo',
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatSelectModule,
    ],
    templateUrl: './demo.component.html',
    styleUrl: './demo.component.scss'
})
export class DemoComponent {
  title = 'WebAppliBlogNilskra'
  selectedColor = '';
  showDetails = false;
  animals = ['Dog', 'Cat', 'Bird'];
  currentAnimal = '';
  name: string | undefined;

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  changeAnimal(animal: string) {
    this.currentAnimal = animal;
  }
}