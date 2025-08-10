// src/app/requirements_specs/req-specs-project-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReqSpecsService } from './req-specs.service';
import { ReqSpecsProject } from './req-specs.types';

@Component({
  selector: 'app-req-specs-project-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-4" *ngIf="project; else loading">
      <h2 class="mb-3">{{ project.name }}</h2>
      <p class="text-muted">{{ project.description || 'No description provided.' }}</p>

      <ul class="list-group mt-3">
        <li class="list-group-item">
          <strong>Company:</strong> {{ companyName(project.companyId) }}
        </li>
        <li class="list-group-item">
          <strong>Sector:</strong> {{ sectorName(project.sectorId) }}
        </li>
        <li class="list-group-item">
          <strong>Status:</strong> {{ project.status }}
        </li>
        <li class="list-group-item">
          <strong>Created:</strong> {{ project.createdAt | date:'short' }}
        </li>
        <li class="list-group-item">
          <strong>Deadline:</strong> {{ project.deadlineAt ? (project.deadlineAt | date:'shortDate') : '—' }}
        </li>
        <li class="list-group-item" *ngIf="project.tags?.length">
          <strong>Tags:</strong> {{ project.tags?.join(', ') }}
        </li>
        <li class="list-group-item">
          <strong>Stakeholders:</strong>
          <ng-container *ngIf="project.stakeholders?.length as count; else noStakeholders">
            {{ count }}
          </ng-container>
          <ng-template #noStakeholders>—</ng-template>
        </li>
      </ul>
    </div>

    <ng-template #loading>
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3">Loading project...</p>
      </div>
    </ng-template>
  `
})
export class ReqSpecsProjectDetailComponent implements OnInit {
  project?: ReqSpecsProject;

  constructor(
    private route: ActivatedRoute,
    private reqSpecsService: ReqSpecsService
  ) {}

  // Resolve human-friendly names from lookup lists in the service
  companyName(id?: string): string {
    if (!id) return '—';
    const c = this.reqSpecsService.companies().find(x => x.id === id);
    return c?.name ?? id;
  }

  sectorName(id?: string): string {
    if (!id) return '—';
    const s = this.reqSpecsService.sectors().find(x => x.id === id);
    return s?.name ?? id;
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.project = await this.reqSpecsService.getProjectById(id);
    }
  }
}
