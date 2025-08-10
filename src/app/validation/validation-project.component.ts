// src/app/validation/validation-project.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { ReqSpecsProject } from '../requirements_specs/req-specs.types';
import { COLL_REQSPECS_PROJECTS } from '../requirements_specs/req-specs.collections';

@Component({
  selector: 'app-validation-project',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-4" *ngIf="project; else loading">
      <h2 class="mb-3">Validation for Project: {{ project.name }}</h2>

      <p class="text-muted">
        Sector: {{ project.sectorId || '—' }} |
        Company: {{ project.companyId || '—' }}
      </p>

      <div class="card p-3 mt-3">
        <h5>Project Description</h5>
        <p class="mb-3">{{ project.description || 'No description provided.' }}</p>

        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <strong>Status:</strong> {{ project.status }}
          </li>
          <li class="list-group-item">
            <strong>Created:</strong> {{ project.createdAt | date:'short' }}
          </li>
          <li class="list-group-item">
            <strong>Deadline:</strong>
            {{ project.deadlineAt ? (project.deadlineAt | date:'shortDate') : '—' }}
          </li>
          <li class="list-group-item" *ngIf="project.tags?.length">
            <strong>Tags:</strong> {{ project.tags?.join(', ') }}
          </li>
          <li class="list-group-item">
            <strong>Stakeholders:</strong>
            <ng-container *ngIf="project.stakeholders?.length as count; else noStakeholders">
              {{ count }}
            </ng-container>
            <ng-template #noStakeholders>—</ng-template>
          </li>
        </ul>
      </div>
    </div>

    <ng-template #loading>
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3">Loading validation project...</p>
      </div>
    </ng-template>
  `
})
export class ValidationProjectComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private firestore = inject(Firestore);

  project?: ReqSpecsProject;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    const ref = doc(this.firestore, COLL_REQSPECS_PROJECTS, id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      this.project = snap.data() as ReqSpecsProject;
    }
  }
}
