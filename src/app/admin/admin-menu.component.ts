import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div class="container">
        <!-- Home link with logo -->
        <a class="navbar-brand d-flex align-items-center" routerLink="/admin">
          <img src="/assets/logos/softadmin.png" alt="Admin Logo" style="height: 40px;" class="me-2">
          Home
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

            <!-- Users link -->
            <li class="nav-item">
              <a class="nav-link" routerLink="/admin/users">
                <i class="bi bi-people me-1"></i>
                Users
              </a>
            </li>

            <!-- Companies link -->
            <li class="nav-item">
              <a class="nav-link" routerLink="/admin/companies">
                <i class="bi bi-building me-1"></i>
                Companies
              </a>
            </li>

            <li class="nav-item">
              <a class="nav-link" routerLink="/admin/audit">
                <i class="bi bi-clipboard-check me-1"></i>
                Audit
              </a>
            </li>


          </ul>
        </div>
      </div>
    </nav>

    <router-outlet></router-outlet>
  `
})
export class AdminMenuComponent {}
