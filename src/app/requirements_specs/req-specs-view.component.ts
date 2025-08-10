import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  Firestore, collection, query, where, collectionData,
} from '@angular/fire/firestore';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ReqSpecsItem, StandardRef, UserRef } from './req-specs.types';
import { COLL_REQSPECS } from './req-specs.collections';

@Component({
  selector: 'app-reqspecs-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="mb-0">Requirement Items</h3>
        <a class="btn btn-outline-success"
           [routerLink]="['/req-specs/project', projectId, 'item']">
          <i class="bi bi-plus-lg me-1"></i> Add Requirement
        </a>
      </div>

      <table class="table table-bordered table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th style="min-width:220px;">Title</th>
            <th>Type</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Standards</th>
            <th>Created</th>
            <th style="width:140px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (item of items(); track item.id) {
            <tr>
              <td class="text-wrap">
                <div class="fw-semibold">{{ item.title }}</div>
                <div class="small text-muted" *ngIf="item.description">{{ item.description }}</div>
              </td>
              <td>{{ item.type }}</td>
              <td><span class="badge bg-info">{{ item.priority }}</span></td>
              <td><span class="badge bg-secondary">{{ item.status }}</span></td>
              <td>
                @if (item.standards?.length) {
                  <div class="small">{{ standardsSummary(item.standards) }}</div>
                } @else {
                  <span class="text-muted">—</span>
                }
              </td>
              <td>
                <div class="small">
                  <div>{{ (item.createdAt || '') | date:'short' }}</div>
                  <div *ngIf="creatorLabel(item.createdBy)" class="text-muted">{{ creatorLabel(item.createdBy) }}</div>
                </div>
              </td>
              <td class="text-nowrap">
                <a class="btn btn-sm btn-outline-primary"
                   [routerLink]="['/req-specs/project', item.projectId, 'item', item.id]">
                  Edit
                </a>
              </td>
            </tr>
          }
          @empty {
            <tr>
              <td colspan="7" class="text-center text-muted py-3">
                No requirements available
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class ReqSpecsViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private firestore = inject(Firestore);
  private destroyRef = inject(DestroyRef);

  projectId = '';
  items = signal<ReqSpecsItem[]>([]);

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id') ?? '';

    // Build query without orderBy to avoid composite index requirement.
    // We sort on the client by updatedAt desc (ISO 8601 string is safe to compare lexicographically).
    const ref = collection(this.firestore, COLL_REQSPECS);
    const q = query(ref, where('projectId', '==', this.projectId));

    collectionData(q, { idField: 'id' })
      .pipe(
        map(rows => {
          const arr = (rows ?? []) as ReqSpecsItem[];
          return [...arr].sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: data => this.items.set(data),
        error: err => {
          console.error('[ReqSpecsView] load error', err);
          this.items.set([]);
        }
      });
  }

  /** Returns short human-readable standards summary, e.g. "ISO 9001 §7.1, IEC 62304 §5" */
  standardsSummary(stds: StandardRef[] | undefined): string {
    if (!stds?.length) return '';
    return stds
      .map(s => [s.code, s.clause].filter(Boolean).join(' §'))
      .join(', ');
    // If you prefer a bullet list, render in template instead of joining.
  }

  /** Extracts a friendly label from UserRef (name > email > uid) */
  creatorLabel(u?: UserRef): string | undefined {
    if (!u) return undefined;
    return (u as any).name || (u as any).email || u.uid;
  }
}
