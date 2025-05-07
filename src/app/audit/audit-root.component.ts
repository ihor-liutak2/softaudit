import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div class="container">
        <!-- Home link with logo -->
        <a class="navbar-brand d-flex align-items-center" routerLink="/audit">
          <img src="/assets/logos/softaudit.png" alt="Audit Logo" style="height: 40px;" class="me-2">
          Audit Home
        </a>

        <div>
          <ul class="navbar-nav">

            <!-- Modules link -->
            <li class="nav-item">
              <a class="nav-link" routerLink="/home">
                <i class="bi bi-grid me-1"></i>
                Modules
              </a>
            </li>

            <!-- Add Project link -->
            <li class="nav-item">
              <a class="nav-link" routerLink="/audit/add-project">
                <i class="bi bi-plus-circle me-1"></i>
                Add Project
              </a>
            </li>

          </ul>
        </div>
      </div>
    </nav>

    <router-outlet></router-outlet>
  `
})
export class AuditRootComponent {}
