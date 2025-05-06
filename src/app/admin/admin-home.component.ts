import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Welcome to Admin Panel Home</h2>
      <p>Manage users, companies, and system modules here.</p>
    </div>
  `
})
export class AdminHomeComponent {}
