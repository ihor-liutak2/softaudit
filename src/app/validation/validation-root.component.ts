import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validation-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div class="container">
        <!-- Home link with logo -->
        <a class="navbar-brand d-flex align-items-center" routerLink="/validation">
          <img src="/assets/logos/softvalidate.png" alt="Validation Logo" style="height: 40px;" class="me-2">
          Validation Home
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

            <!-- View Projects link -->
            <li class="nav-item">
              <a class="nav-link" routerLink="/validation">
                <i class="bi bi-list-check me-1"></i>
                View Projects
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <router-outlet></router-outlet>
  `
})
export class ValidationRootComponent {}
