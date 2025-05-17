import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReqSpecsService } from './req-specs.service';
import { ReqSpecsProject } from './req-specs.types';

@Component({
  selector: 'app-req-specs-project-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-4" *ngIf="project; else loading">
      <h2 class="mb-3">{{ project.title }}</h2>
      <p class="text-muted">{{ project.description || 'No description provided.' }}</p>

      <ul class="list-group mt-3">
        <li class="list-group-item"><strong>Company:</strong> {{ project.companyId }}</li>
        <li class="list-group-item"><strong>Sector:</strong> {{ project.sector }}</li>
        <li class="list-group-item"><strong>Status:</strong> {{ project.status }}</li>
        <li class="list-group-item"><strong>Start:</strong> {{ project.startDate }}</li>
        <li class="list-group-item"><strong>End:</strong> {{ project.endDate || '—' }}</li>
      </ul>
    </div>

    <ng-template #loading>
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3">Loading project...</p>
      </div>
    </ng-template>
  `
})
export class ReqSpecsProjectDetailComponent implements OnInit {
  project!: ReqSpecsProject | undefined;

  constructor(
    private route: ActivatedRoute,
    private reqSpecsService: ReqSpecsService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.project = await this.reqSpecsService.getProjectById(id);
    }
  }
}
