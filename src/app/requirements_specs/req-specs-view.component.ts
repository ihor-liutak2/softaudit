import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Firestore, collection, query, where, collectionData } from '@angular/fire/firestore';
import { ReqSpecsItem } from './req-specs.types';
import { ReqSpecsTableComponent } from './req-specs-table.component';

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
  private route = inject(ActivatedRoute);
  private firestore = inject(Firestore);

  projectId = '';
  items = signal<ReqSpecsItem[]>([]);

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id') ?? '';

    const reqRef = collection(this.firestore, 'reqspecs');
    const q = query(reqRef, where('projectId', '==', this.projectId));

    collectionData(q, { idField: 'id' }).subscribe(data => {
      this.items.set(data as ReqSpecsItem[]);
    });
  }
}
