// Import required Angular modules and services
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { UserService } from '../user/user.service';

type ModuleItem = {
  name: string;
  link: string;
  logo: string;
  color: string;
  description: string;
};

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Main container with page title -->
    <div class="container py-5 text-center">
      <!-- Main logo -->
      <img src="/assets/logos/softassure.png" alt="SoftAssure Logo" style="max-height: 100px;" class="mb-4">

      <h2 class="mb-5">SoftAssure Modules</h2>

      <div class="row justify-content-center">

        @for (module of visibleModules; track module.name) {
          <!-- Module card -->
          <div class="col-12 col-md-6 mb-4" (click)="go(module.link)">
            <div class="card h-100" [ngStyle]="{'border': '2px solid ' + module.color, 'cursor': 'pointer'}">
              <div class="card-body text-center">

                <!-- Module logo -->
                <img [src]="module.logo" alt="{{module.name}}" style="max-height: 80px;" class="mb-3">

                <!-- Module title and description -->
                <h4>{{module.name}}</h4>
                <p>{{module.description}}</p>

              </div>
            </div>
          </div>
        }

      </div>
    </div>
  `
})
export class GeneralComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  

  // Array of modules (Audit, Validation, Verification)
   private readonly modules: ModuleItem[] = [
    {
      name: 'Audit Module',
      link: '/audit',
      logo: '/assets/logos/softaudit.png',
      color: '#B40F83',
      description: 'Plan, execute and review software audits efficiently.'
    },
    {
      name: 'Validation Module',
      link: '/validation',
      logo: '/assets/logos/softvalidate.png',
      color: '#B82C59',
      description: 'Ensure correctness and completeness of software systems.'
    },
    {
      name: 'Verification Module',
      link: '/verification',
      logo: '/assets/logos/softverify.png',
      color: '#9D4349',
      description: 'Check conformity and performance of software solutions.'
    }
  ];

  // Add Admin module if user is admin
  get visibleModules(): ModuleItem[] {
    if (this.userService.user?.role === 'admin') {
      return [
        ...this.modules,
        {
          name: 'Admin Module',
          link: '/admin',
          logo: '/assets/logos/softadmin.png',
          color: '#861F40',
          description: 'Manage users, settings and review audit data.'
        }
      ];
    }
    return this.modules;
  }

  // Navigate to selected module
  go(link: string) {
    this.router.navigate([link]);
  }
}
