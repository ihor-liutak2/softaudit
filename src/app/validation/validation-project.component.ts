import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { ReqSpecsProject } from '../requirements_specs/req-specs.types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-validation-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4" *ngIf="project; else loading">
      <h2 class="mb-3">Validation for Project: {{ project.title }}</h2>
      <p class="text-muted">Sector: {{ project.sector }} | Company: {{ project.companyId }}</p>

      <div class="card p-3 mt-3">
        <h5>Project Description</h5>
        <p>{{ project.description || 'No description provided.' }}</p>

        <ul class="list-group list-group-flush">
          <li class="list-group-item"><strong>Status:</strong> {{ project.status }}</li>
          <li class="list-group-item"><strong>Start:</strong> {{ project.startDate }}</li>
          <li class="list-group-item"><strong>End:</strong> {{ project.endDate || '—' }}</li>
        </ul>
      </div>

      <!-- Later: Insert validation findings, forms, checklist, etc. -->
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
    if (id) {
      const snap = await getDoc(doc(this.firestore, 'reqspecs-projects', id));
      if (snap.exists()) {
        this.project = snap.data() as ReqSpecsProject;
      }
    }
  }
}
