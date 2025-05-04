import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Admin Module</h2>
    <p>Welcome, administrator!</p>
  `
})
export class AdminRootComponent {}
