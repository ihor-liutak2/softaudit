import { Component, OnInit, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService } from './audit.service';
import { AuditProjectTableComponent } from './audit-project-table.component';
import { Company, AuditProject } from '../core/general/general.types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-audit-home',
  standalone: true,
  imports: [CommonModule, AuditProjectTableComponent],
  template: `
    <div class="container py-5">
      <h2>Welcome to Audit Module</h2>
      <p class="text-muted">Manage and create audit projects to ensure quality and compliance.</p>

      <hr class="my-4">

      <h4>All Audit Projects</h4>

      @if (loading()) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading projects...</p>
        </div>
      } @else {

        @if (projects().length) {
          <app-audit-project-table
            [projects]="projects()"
            [companies]="companies()"
            (editProject)="onEditProject($event)"
            (manageFindings)="onManageFindings($event)">
          </app-audit-project-table>
        } @else {
          <p class="text-muted">No projects found.</p>
        }

      }
    </div>
  `
})
export class AuditHomeComponent implements OnInit {

  projects = computed(() => this.auditService.projects());
  companies = computed(() => this.auditService.companies());
  loading = signal(true);

  constructor(
    private auditService: AuditService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auditService.loadCompanies();
  
    this.auditService.loadAllAuditProjects().then(() => {
      this.loading.set(false);
    });
  }

  onEditProject(project: AuditProject) {
    if (!project.id) {
      console.error('Project has no ID');
      return;
    }

    this.router.navigate(['/audit/edit', project.id]);
}

onManageFindings(project: AuditProject) {
  if (!project.id) {
    console.error('Project has no ID');
    return;
  }

  this.router.navigate(['/audit/findings', project.id]);
}

}
