import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReqSpecsProjectTableComponent } from './req-specs-project-table.component';
import { ReqSpecsService } from './req-specs.service';
import { ReqSpecsProject } from './req-specs.types';
import { UserService } from '../core/user/user.service';
import { AppUser } from '../core/user/user.model';

@Component({
  selector: 'app-req-specs-home',
  standalone: true,
  imports: [CommonModule, ReqSpecsProjectTableComponent],
  template: `
    <div class="container py-5">
      <h2>Welcome to Requirements & Specs</h2>
      <p class="text-muted">Capture, manage, and track software requirements and technical specifications.</p>

      <hr class="my-4">

      <h4>All Requirement Projects</h4>

      @if (loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading projects...</p>
        </div>
      } @else {

        @if (visibleProjects().length) {
          <app-req-specs-project-table
            [projects]="visibleProjects()"
            [companies]="companies()"
            [currentUser]="currentUser"
            (editProject)="onEditProject($event)"
            (manageDetails)="onManageDetails($event)"
            (deleteProject)="onDeleteProject($event)">
          </app-req-specs-project-table>
        } @else {
          <p class="text-muted">No projects found.</p>
        }

      }
    </div>
  `
})
export class ReqSpecsHomeComponent implements OnInit {
  // Services
  private readonly reqSpecsService = inject(ReqSpecsService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  // Authenticated user (used for ACL)
  currentUser?: AppUser;

  // Loading flag for initial data fetch
  loading = signal(true);

  // Companies come from the service cache
  companies = computed(() => this.reqSpecsService.companies());

  // All projects cached in the service
  private allProjects = computed(() => this.reqSpecsService.projects());

  // Projects visible to the current user (admin OR owner OR stakeholder)
  visibleProjects = computed<ReqSpecsProject[]>(() => {
    const u = this.currentUser;
    const list = this.allProjects();
    if (!u) return []; // no user -> nothing visible
    return list.filter(p => this.reqSpecsService.canView(p, u));
  });

  // Init: load user, companies, and projects; then compute visibility on client
  async ngOnInit() {
    // Resolve current user (synchronous accessor from your UserService)
    this.currentUser = this.userService.user || undefined;

    try {
      // Load supporting lookups first
      await this.reqSpecsService.loadCompanies();

      // Load all projects into the service cache.
      // Server-side security rules still protect data; client filters visibility additionally.
      await this.reqSpecsService.loadAllProjects();
    } finally {
      this.loading.set(false);
    }
  }

  // Navigate to edit form
  onEditProject(project: ReqSpecsProject) {
    if (!project.id) {
      console.error('Project has no ID');
      return;
    }
    this.router.navigate(['/req-specs/edit', project.id]);
  }

  // Navigate to project details
  onManageDetails(project: ReqSpecsProject) {
    if (!project.id) {
      console.error('Project has no ID');
      return;
    }
    this.router.navigate(['/req-specs/details', project.id]);
  }

  // Delete handler (only admin or owner sees the button; guard again here)
  async onDeleteProject(p: ReqSpecsProject) {
    if (!this.currentUser) return;
    if (!this.reqSpecsService.canDelete(p, this.currentUser)) return;

    await this.reqSpecsService.deleteProject(p.id);

    // Refresh the list after deletion
    await this.reqSpecsService.loadAllProjects();
  }
}
