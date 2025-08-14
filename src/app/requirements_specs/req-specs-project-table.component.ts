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
          <th style="width:32%">Name</th>
          <th style="width:16%">Company</th>
          <th style="width:12%">Sector</th>
          <th style="width:10%">Status</th>
          <th style="width:12%">Deadline</th>
          <th style="width:12%">Updated</th>
          <th style="width:240px">Actions</th>
        </tr>
      </thead>

      <tbody>
        @for (project of filteredProjects(); track project.id) {
          <tr>
            <!-- Name + short description + up to 3 tags -->
            <td>
              <div class="fw-semibold">{{ project.name }}</div>

              @if (project.description) {
                <div class="text-muted small">
                  {{ short(project.description, 100) }}
                </div>
              }

              @if (project.tags?.length) {
                <div class="mt-1">
                  @for (t of previewTags(project.tags); track t) {
                    <span class="badge rounded-pill text-bg-light me-1">{{ t }}</span>
                  }
                  @if ((project.tags?.length || 0) > 3) {
                    <span class="text-muted small">+{{ (project.tags?.length || 0) - 3 }}</span>
                  }
                </div>
              }
            </td>

            <!-- Company -->
            <td>{{ companyName(project.companyId) }}</td>

            <!-- Sector -->
            <td>{{ sectorName(project.sectorId) }}</td>

            <!-- Status -->
            <td>
              <span class="badge" [ngClass]="statusClass(project.status)">
                {{ project.status }}
              </span>
            </td>

            <!-- Dates -->
            <td>{{ project.deadlineAt ? (project.deadlineAt | date:'shortDate') : '—' }}</td>
            <td>{{ project.updatedAt | date:'short' }}</td>

            <!-- Actions -->
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
                [routerLink]="['/req-specs/view', project.id]"
                class="btn btn-sm btn-outline-secondary me-2">
                <i class="bi bi-list-ul"></i> Items
              </a>

              <a
                [routerLink]="['/req-specs/project', project.id, 'item']"
                class="btn btn-sm btn-outline-success me-2">
                <i class="bi bi-plus-lg"></i> Add Item
              </a>

              <a
                [routerLink]="['/req-specs/srs', project.id]"
                class="btn btn-sm btn-outline-success">
                <i class="bi bi-file-earmark-text"></i> SRS
              </a>
            </td>
          </tr>
        }

        @empty {
          <tr>
            <td colspan="7" class="text-center text-muted py-4">
              No projects found
            </td>
          </tr>
        }
      </tbody>
    </table>
  `
})
export class ReqSpecsProjectTableComponent {
  // Lookups provided by parent
  @Input() companies: Company[] = [];
  @Input() sectors: Sector[] = [];

  // Projects as a signal so filtering recomputes reliably
  private _projects = signal<ReqSpecsProject[]>([]);
  @Input() set projects(value: ReqSpecsProject[]) { this._projects.set(value ?? []); }
  get projects(): ReqSpecsProject[] { return this._projects(); }

  // Events
  @Output() editProject = new EventEmitter<ReqSpecsProject>();
  @Output() manageDetails = new EventEmitter<ReqSpecsProject>();

  // Filter state
  searchText = signal('');
  filterCompany = signal('');
  filterStatus = signal('');

  // Derived filtered view
  filteredProjects = computed(() => {
    const q = (this.searchText() || '').trim().toLowerCase();
    const companyId = this.filterCompany();
    const status = this.filterStatus();

    return this._projects().filter(p => {
      const matchesText =
        !q ||
        (p.name || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q);

      const matchesCompany = !companyId || p.companyId === companyId;
      const matchesStatus  = !status || p.status === status;

      return matchesText && matchesCompany && matchesStatus;
    });
  });

  // --- View helpers ----------------------------------------------------------

  /** Return up to 3 tags for compact preview */
  previewTags(tags: string[] = []): string[] {
    return tags.slice(0, 3);
  }

  /** Safe company name */
  companyName(id?: string): string {
    if (!id) return '—';
    return this.companies.find(c => c.id === id)?.name ?? id;
  }

  /** Safe sector name */
  sectorName(id?: string): string {
    if (!id) return '—';
    return this.sectors.find(s => s.id === id)?.name ?? id;
  }

  /** Map status to Bootstrap badge look */
  statusClass(s: string): string {
    switch ((s || '').toLowerCase()) {
      case 'draft':        return 'text-bg-secondary';
      case 'in-progress':  return 'text-bg-info';
      case 'approved':     return 'text-bg-success';
      case 'archived':     return 'text-bg-dark';
      default:             return 'text-bg-light';
    }
  }

  /** Simple text truncation with ellipsis */
  short(text: string, max = 100): string {
    if (!text) return '';
    return text.length <= max ? text : text.slice(0, max - 1).trimEnd() + '…';
  }
}
