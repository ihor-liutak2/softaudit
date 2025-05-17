import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReqSpecsProjectTableComponent } from './req-specs-project-table.component';
import { ReqSpecsService } from './req-specs.service';
import { ReqSpecsProject } from './req-specs.types';


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

        @if (projects().length) {
          <app-req-specs-project-table
            [projects]="projects()"
            [companies]="companies()"
            (editProject)="onEditProject($event)"
            (manageDetails)="onManageDetails($event)">
          </app-req-specs-project-table>
        } @else {
          <p class="text-muted">No projects found.</p>
        }

      }
    </div>
  `
})
export class ReqSpecsHomeComponent implements OnInit {

  projects = computed(() => this.reqSpecsService.projects());
  companies = computed(() => this.reqSpecsService.companies());
  loading = signal(true);

  constructor(
    private reqSpecsService: ReqSpecsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.reqSpecsService.loadCompanies();
    this.reqSpecsService.loadAllProjects().then(() => {
      this.loading.set(false);
    });
  }

  onEditProject(project: ReqSpecsProject) {
    if (!project.id) {
      console.error('Project has no ID');
      return;
    }
    this.router.navigate(['/req-specs/edit', project.id]);
  }

  onManageDetails(project: ReqSpecsProject) {
    if (!project.id) {
      console.error('Project has no ID');
      return;
    }
    this.router.navigate(['/req-specs/details', project.id]);
  }
}
