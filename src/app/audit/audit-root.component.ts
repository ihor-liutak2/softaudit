import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Audit Module</h2>
    <p>Welcome to the audit module!</p>
  `
})
export class AuditRootComponent {}
