import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container text-center py-5">
      <h2>Welcome to Audit Module</h2>
      <p class="text-muted">Manage and create audit projects to ensure quality and compliance.</p>
    </div>
  `
})
export class AuditHomeComponent {}
