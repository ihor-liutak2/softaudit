import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  Firestore,
  collection,
  query,
  where,
  collectionData,
  CollectionReference,
  DocumentData,
  orderBy,
} from '@angular/fire/firestore';
import { ReqSpecsItem } from './req-specs.types';
import { ReqSpecsTableComponent } from './req-specs-table.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-reqspecs-view',
  standalone: true,
  imports: [CommonModule, RouterModule, ReqSpecsTableComponent],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="mb-0">Requirement Specifications</h3>
        <a [routerLink]="['/req-specs/project', projectId, 'item']" class="btn btn-outline-success">
          <i class="bi bi-plus-lg me-1"></i> Add Requirement
        </a>
      </div>

      @if (items().length > 0) {
        <app-req-specs-table [items]="items()"></app-req-specs-table>
      } @else {
        <p class="text-muted">No requirements found for this project.</p>
      }
    </div>
  `
})
export class ReqSpecsViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly firestore = inject(Firestore);
  private readonly destroyRef = inject(DestroyRef);

  projectId = '';
  items = signal<ReqSpecsItem[]>([]);

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.projectId) {
      this.items.set([]);
      return;
    }

    const reqRef: CollectionReference<DocumentData> = collection(this.firestore, 'reqspecs');
    const q = query(
      reqRef,
      where('projectId', '==', this.projectId),
      orderBy('updatedAt', 'desc') // optional
    );

    collectionData(q, { idField: 'id' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.items.set(data as ReqSpecsItem[]),
        error: (err) => {
          console.error('Failed to load reqspecs:', err);
          this.items.set([]);
        },
      });
  }
}
