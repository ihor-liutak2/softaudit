import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReqSpecsProject } from './req-specs.types';
import { Company, Sector } from '../core/general/general.types';

@Component({
  selector: 'app-req-specs-project-table',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <!-- Filters -->
    <div class="p-3 border rounded bg-light mb-4">
      <div class="row g-2">
        <div class="col-md-4">
          <input
            type="text"
            class="form-control"
            placeholder="Search by name"
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
            <option value="in-progress">In Progress</option>
            <option value="approved">Approved</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <table class="table table-bordered table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th>Name</th>
          <th>Company</th>
          <th>Sector</th>
          <th>Status</th>
          <th>Deadline</th>
          <th>Updated</th>
          <th style="width: 240px;">Actions</th>
        </tr>
      </thead>
      <tbody>
        @for (project of filteredProjects(); track project.id) {
          <tr>
            <td>
              <div class="fw-semibold">{{ project.name }}</div>
              <div class="text-muted small" *ngIf="project.description">{{ project.description }}</div>
              <div class="mt-1" *ngIf="project.tags?.length">
                <span class="badge rounded-pill text-bg-light me-1" *ngFor="let t of previewTags(project.tags)">
                  {{ t }}
                </span>
                <span class="text-muted small" *ngIf="(project.tags?.length || 0) > 3">
                  +{{ (project.tags?.length || 0) - 3 }}
                </span>
              </div>
            </td>
            <td>{{ companyName(project.companyId) }}</td>
            <td>{{ sectorName(project.sectorId) }}</td>
            <td>
              <span class="badge" [ngClass]="statusClass(project.status)">
                {{ project.status }}
              </span>
            </td>
            <td>{{ project.deadlineAt ? (project.deadlineAt | date:'shortDate') : '—' }}</td>
            <td>{{ project.updatedAt | date:'short' }}</td>
            <td class="text-nowrap">
              <button
                class="btn btn-sm btn-outline-primary me-2"
                (click)="editProject.emit(project)">
                <i class="bi bi-pencil"></i> Edit
              </button>

              <a
                [routerLink]="['/req-specs/project', project.id]"
                class="btn btn-sm btn-outline-dark me-2">
                <i class="bi bi-eye"></i> Open
              </a>

              <a
                [routerLink]="['/req-specs/project', project.id, 'item']"
                class="btn btn-sm btn-outline-success">
                <i class="bi bi-plus-lg"></i> Add Item
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
  // We keep companies/sectors as plain inputs used for lookups
  @Input() companies: Company[] = [];
  @Input() sectors: Sector[] = [];

  // Turn projects into a signal so computed() re-evaluates on @Input change
  private _projects = signal<ReqSpecsProject[]>([]);
  @Input() set projects(value: ReqSpecsProject[]) {
    this._projects.set(value ?? []);
  }
  get projects(): ReqSpecsProject[] {
    return this._projects();
  }

  @Output() editProject = new EventEmitter<ReqSpecsProject>();
  @Output() manageDetails = new EventEmitter<ReqSpecsProject>();

  // UI state (filters)
  searchText = signal('');
  filterCompany = signal('');
  filterStatus = signal('');

  // Derived view: filtered list
  filteredProjects = computed(() => {
    const q = (this.searchText() || '').trim().toLowerCase();
    const companyId = this.filterCompany();
    const status = this.filterStatus();

    return this._projects().filter(project => {
      const matchesName =
        !q ||
        (project.name || '').toLowerCase().includes(q) ||
        (project.description || '').toLowerCase().includes(q);

      const matchesCompany = !companyId || project.companyId === companyId;
      const matchesStatus = !status || project.status === status;

      return matchesName && matchesCompany && matchesStatus;
    });
  });

  /** Show up to 3 tags in the table row */
  previewTags(tags: string[] = []): string[] {
    return tags.slice(0, 3);
  }

  /** Resolve company name from id */
  companyName(companyId?: string): string {
    if (!companyId) return '—';
    return this.companies.find(c => c.id === companyId)?.name || companyId;
  }

  /** Resolve sector name from id */
  sectorName(sectorId?: string): string {
    if (!sectorId) return '—';
    return this.sectors.find(s => s.id === sectorId)?.name || sectorId;
  }

  /** Map project status to Bootstrap badge class */
  statusClass(s: string): string {
    switch ((s || '').toLowerCase()) {
      case 'draft': return 'text-bg-secondary';
      case 'in-progress': return 'text-bg-info';
      case 'approved': return 'text-bg-success';
      case 'archived': return 'text-bg-dark';
      default: return 'text-bg-light';
    }
  }
}
