import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validation-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container text-center mt-5">
      <h2>Validation Module</h2>
      <p>Welcome to the Validation module. Select a task from the menu or start validation process.</p>
    </div>
  `
})
export class ValidationRootComponent {}
