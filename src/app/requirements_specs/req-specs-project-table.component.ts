import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReqSpecsProject } from './req-specs.types';
import { Company } from '../core/general/general.types';

@Component({
  selector: 'app-req-specs-project-table',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="p-3 border rounded bg-light mb-4">
      <div class="row g-2">
        <div class="col-md-4">
          <input
            type="text"
            class="form-control"
            placeholder="Search by title"
            [ngModel]="searchText()"
            (ngModelChange)="searchText.set($event)">
        </div>
        <div class="col-md-4">
          <select
            class="form-select"
            [ngModel]="filterCompany()"
            (ngModelChange)="filterCompany.set($event)">
            <option value="">All Companies</option>
            @for (company of companies; track company.id) {
              <option [value]="company.id">{{ company.name }}</option>
            }
          </select>
        </div>
        <div class="col-md-4">
          <select
            class="form-select"
            [ngModel]="filterStatus()"
            (ngModelChange)="filterStatus.set($event)">
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="in_progress">In Progress</option>
            <option value="approved">Approved</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
    </div>

    <table class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th>Title</th>
          <th>Company</th>
          <th>Sector</th>
          <th>Start</th>
          <th>End</th>
          <th>Status</th>
          <th style="width: 200px;">Actions</th>
        </tr>
      </thead>
      <tbody>
        @for (project of filteredProjects(); track project.id) {
          <tr>
            <td>{{ project.title }}</td>
            <td>{{ companyName(project.companyId) }}</td>
            <td>{{ project.sector }}</td>
            <td>{{ project.startDate }}</td>
            <td>{{ project.endDate || '—' }}</td>
            <td><span class="badge bg-secondary">{{ project.status }}</span></td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-2" (click)="editProject.emit(project)">
                <i class="bi bi-pencil"></i> Edit
              </button>

              <a [routerLink]="['/req-specs/project', project.id]" class="btn btn-sm btn-outline-dark">
                <i class="bi bi-eye"></i> View
              </a>
            </td>
          </tr>
        }
        @empty {
          <tr>
            <td colspan="7" class="text-center text-muted py-4">No projects found</td>
          </tr>
        }
      </tbody>
    </table>
  `
})
export class ReqSpecsProjectTableComponent {
  @Input() projects: ReqSpecsProject[] = [];
  @Input() companies: Company[] = [];

  @Output() editProject = new EventEmitter<ReqSpecsProject>();
  @Output() manageDetails = new EventEmitter<ReqSpecsProject>();

  searchText = signal('');
  filterCompany = signal('');
  filterStatus = signal('');

  filteredProjects = computed(() => {
    return this.projects.filter(project => {
      const matchesTitle = this.searchText().trim() === '' || project.title.toLowerCase().includes(this.searchText().toLowerCase());
      const matchesCompany = !this.filterCompany() || project.companyId === this.filterCompany();
      const matchesStatus = !this.filterStatus() || project.status === this.filterStatus();
      return matchesTitle && matchesCompany && matchesStatus;
    });
  });

  companyName(companyId: string): string {
    return this.companies.find(c => c.id === companyId)?.name || companyId;
  }
}
