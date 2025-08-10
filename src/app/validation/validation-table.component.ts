// src/app/validation/validation-table.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ReqSpecsProject } from '../requirements_specs/req-specs.types';
import { Company, Sector } from '../core/general/general.types';

@Component({
  selector: 'app-validation-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <table class="table table-bordered table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th>Name</th>
          <th>Company</th>
          <th>Sector</th>
          <th>Status</th>
          <th>Dates</th>
          <th style="width: 140px;">Actions</th>
        </tr>
      </thead>
      <tbody>
        @for (project of projects; track project.id) {
          <tr>
            <td class="text-wrap">
              <div class="fw-semibold">{{ project.name }}</div>
              <div class="small text-muted" *ngIf="project.description">{{ project.description }}</div>
            </td>

            <td>{{ companyName(project.companyId) }}</td>
            <td>{{ sectorName(project.sectorId) }}</td>

            <td>
              <span class="badge bg-secondary">{{ project.status }}</span>
            </td>

            <td class="small">
              <div>Created: {{ project.createdAt | date:'shortDate' }}</div>
              <div>Deadline: {{ project.deadlineAt ? (project.deadlineAt | date:'shortDate') : '—' }}</div>
            </td>

            <td class="text-nowrap">
              <!-- Navigates to /validation/project/:id -->
              <a [routerLink]="['/validation/project', project.id]" class="btn btn-sm btn-outline-primary">
                <i class="bi bi-box-arrow-up-right"></i> Open
              </a>
            </td>
          </tr>
        }
        @empty {
          <tr>
            <td colspan="6" class="text-center text-muted py-4">No projects found</td>
          </tr>
        }
      </tbody>
    </table>
  `
})
export class ValidationTableComponent {
  @Input() projects: ReqSpecsProject[] = [];

  // Optional lookup lists to render human-friendly names
  @Input() companies: Company[] = [];
  @Input() sectors: Sector[] = [];

  @Output() view = new EventEmitter<ReqSpecsProject>();

  /** Maps companyId -> company name (falls back to id if not found) */
  companyName(id?: string): string {
    if (!id) return '—';
    return this.companies.find(c => c.id === id)?.name ?? id;
  }

  /** Maps sectorId -> sector name (falls back to id if not found) */
  sectorName(id?: string): string {
    if (!id) return '—';
    return this.sectors.find(s => s.id === id)?.name ?? id;
  }
}
