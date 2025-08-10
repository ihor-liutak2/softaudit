import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  Firestore,
  collection,
  query,
  where,
  orderBy,
  collectionData,
} from '@angular/fire/firestore';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReqSpecsItem } from './req-specs.types';
import { ReqSpecsTableComponent } from './req-specs-table.component';
import { COLL_REQSPECS } from './req-specs.collections';

@Component({
  selector: 'app-reqspecs-view',
  standalone: true,
  imports: [CommonModule, RouterModule, ReqSpecsTableComponent],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="mb-0">Requirement Specifications</h3>
        <a
          class="btn btn-outline-success"
          [routerLink]="['/req-specs/project', projectId, 'item']">
          <i class="bi bi-plus-lg me-1"></i>
          Add Requirement
        </a>
      </div>

      <ng-container *ngIf="items().length; else empty">
        <app-req-specs-table [items]="items()"></app-req-specs-table>
      </ng-container>

      <ng-template #empty>
        <p class="text-muted">No requirements found for this project.</p>
      </ng-template>
    </div>
  `
})
export class ReqSpecsViewComponent implements OnInit {
  // DI
  private readonly route = inject(ActivatedRoute);
  private readonly firestore = inject(Firestore);
  private readonly destroyRef = inject(DestroyRef);

  // Route param and data
  projectId = '';
  items = signal<ReqSpecsItem[]>([]);

  ngOnInit() {
    // Read project id from route
    this.projectId = this.route.snapshot.paramMap.get('id') ?? '';

    // Build Firestore query (filter by project and sort by last update)
    const ref = collection(this.firestore, COLL_REQSPECS);
    const q = query(
      ref,
      where('projectId', '==', this.projectId),
      orderBy('updatedAt', 'desc')
    );

    // Subscribe to live data and keep it typed
    collectionData<ReqSpecsItem>(q as any, { idField: 'id' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.items.set(data ?? []),
        error: (err) => {
          console.error('[ReqSpecsView] load error', err);
          this.items.set([]);
        },
      });
  }
}
