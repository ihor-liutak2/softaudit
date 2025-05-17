import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-req-specs-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div class="container">
        <!-- Home link with logo -->
        <a class="navbar-brand d-flex align-items-center" routerLink="/req-specs">
          <img src="/assets/logos/requirements.png" alt="Requirements Logo" style="height: 40px;" class="me-2">
          Req & Specs Home
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
              <a class="nav-link" routerLink="/req-specs/add-project">
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
export class ReqSpecsRootComponent {}
