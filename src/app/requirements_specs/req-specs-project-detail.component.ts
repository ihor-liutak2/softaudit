// src/app/requirements_specs/req-specs-project-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { ReqSpecsService } from './req-specs.service';
import { ReqSpecsProject, ReqSpecsItem } from './req-specs.types';
import { ReqSpecsTableComponent } from './req-specs-table.component';

// Firestore-only used here to read items for this project
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { COLL_REQSPECS } from './req-specs.collections';

@Component({
  selector: 'app-req-specs-project-detail',
  standalone: true,
  imports: [CommonModule, ReqSpecsTableComponent],
  template: `
    <div class="container py-4">
      @if (project) {
        <h2 class="mb-3">{{ project!.name }}</h2>
        <p class="text-muted">{{ project!.description || 'No description provided.' }}</p>

        <!-- Project facts -->
        <ul class="list-group mt-3">
          <li class="list-group-item">
            <strong>Company:</strong> {{ companyName(project!.companyId) }}
          </li>
          <li class="list-group-item">
            <strong>Sector:</strong> {{ sectorName(project!.sectorId) }}
          </li>
          <li class="list-group-item">
            <strong>Status:</strong> {{ project!.status }}
          </li>
          <li class="list-group-item">
            <strong>Created:</strong> {{ project!.createdAt | date:'short' }}
          </li>
          <li class="list-group-item">
            <strong>Deadline:</strong> {{ project!.deadlineAt ? (project!.deadlineAt | date:'shortDate') : '—' }}
          </li>

          <!-- Tags (optional) -->
          @if (project!.tags?.length) {
            <li class="list-group-item">
              <strong>Tags:</strong>
              <span class="ms-1">
                @for (t of project!.tags!; track t) {
                  <span class="badge text-bg-light me-1">{{ t }}</span>
                }
              </span>
            </li>
          }

          <!-- Connected standards -->
          <li class="list-group-item">
            <strong>Standards:</strong>
            @if (project!.standards?.length) {
              <span class="ms-2">
                @for (s of project!.standards!; track $index) {
                  <span class="badge text-bg-light me-2">
                    {{ s.code }}@if (s.clause) { <span> §{{ s.clause }}</span> }
                  </span>
                }
              </span>
            } @else {
              <span class="ms-1">—</span>
            }
          </li>

          <!-- Stakeholders count -->
          <li class="list-group-item">
            <strong>Stakeholders:</strong>
            @if (project!.stakeholders?.length) {
              <span class="ms-1">{{ project!.stakeholders!.length }}</span>
            } @else {
              <span class="ms-1">—</span>
            }
          </li>
        </ul>

        <!-- Items for this project -->
        <div class="mt-4">
          <h5 class="mb-2">Requirement Items</h5>

          @if (items.length) {
            <app-req-specs-table
              [items]="items"
              [projectStandards]="project.standards ?? []">
            </app-req-specs-table>
          } @else {
            <div class="text-muted">No items for this project yet.</div>
          }
        </div>
      } @else {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-3">Loading project...</p>
        </div>
      }
    </div>
  `
})
export class ReqSpecsProjectDetailComponent implements OnInit {
  project?: ReqSpecsProject;
  items: ReqSpecsItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private reqSpecsService: ReqSpecsService,
    private firestore: Firestore
  ) {}

  // Human-friendly names from lookup lists in the service
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
    if (!id) return;

    // Load project
    this.project = await this.reqSpecsService.getProjectById(id);

    // Load items for the project (read-only; no service changes required)
    await this.loadItemsForProject(id);
  }

  /** Fetch project items from Firestore by projectId */
  private async loadItemsForProject(projectId: string) {
    try {
      const coll = collection(this.firestore, COLL_REQSPECS);
      const q = query(coll, where('projectId', '==', projectId));
      const snap = await getDocs(q);
      this.items = snap.docs.map(d => d.data() as ReqSpecsItem);
    } catch (err) {
      console.error('Failed to load project items', err);
      this.items = [];
    }
  }
}
