import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReqSpecsProject } from '../requirements_specs/req-specs.types';
import { ReqSpecsService } from '../requirements_specs/req-specs.service';
import { ValidationTableComponent } from './validation-table.component';

@Component({
  selector: 'app-validation-home',
  standalone: true,
  imports: [CommonModule, ValidationTableComponent],
  template: `
    <div class="container py-5">
      <h2>Validation Dashboard</h2>
      <p class="text-muted">Review and manage specification projects for validation.</p>

      <hr class="my-4">

      <h4>Available Projects</h4>

      @if (loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading projects...</p>
        </div>
      } @else {

        @if (projects().length) {
          <app-validation-table
            [projects]="projects()"
            (view)="onView($event)">
          </app-validation-table>
        } @else {
          <p class="text-muted">No validation projects found.</p>
        }

      }
    </div>
  `
})
export class ValidationHomeComponent implements OnInit {
  loading = signal(true);
  projects = computed(() => this.reqSpecsService.projects());

  constructor(
    private reqSpecsService: ReqSpecsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.reqSpecsService.loadAllProjects().then(() => {
      this.loading.set(false);
    });
  }

  onView(project: ReqSpecsProject) {
    this.router.navigate(['/validation/project', project.id]);
  }
}
