import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verification-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container text-center mt-5">
      <h2>Verification Module</h2>
      <p>Welcome to the Verification module. Select a task from the menu or start verification process.</p>
    </div>
  `
})
export class VerificationRootComponent {}
