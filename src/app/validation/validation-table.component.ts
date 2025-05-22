import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReqSpecsProject } from '../requirements_specs/req-specs.types';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-validation-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Title</th>
          <th>Company</th>
          <th>Sector</th>
          <th>Status</th>
          <th>Dates</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        @for (project of projects; track project.id) {
          <tr>
            <td>{{ project.title }}</td>
            <td>{{ project.companyId }}</td>
            <td>{{ project.sector }}</td>
            <td>{{ project.status }}</td>
            <td>{{ project.startDate }} – {{ project.endDate || '—' }}</td>
            <td class="d-flex gap-2">
              <!-- Navigates to /validation/project/:id -->
              <a [routerLink]="['/validation/project', project.id]" class="btn btn-outline-primary btn-sm">
                <i class="bi bi-box-arrow-up-right"></i> Open
              </a>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `
})
export class ValidationTableComponent {
  @Input() projects: ReqSpecsProject[] = [];
  @Output() view = new EventEmitter<ReqSpecsProject>();
}
