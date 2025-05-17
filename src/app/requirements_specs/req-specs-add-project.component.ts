import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReqSpecsService } from './req-specs.service';
import { ReqSpecsProject } from './req-specs.types';
import { Company, Sector } from '../core/general/general.types';
import { ReqSpecsProjectFormComponent } from './req-specs-project-form.component ';

@Component({
  selector: 'app-req-specs-add-project',
  standalone: true,
  imports: [CommonModule, ReqSpecsProjectFormComponent],
  template: `
    <div class="container py-4">
      <h3 class="mb-3">Add / Edit Requirements Project</h3>

      <ng-container *ngIf="project">
        <app-req-specs-project-form
          [project]="project"
          [companies]="companies"
          [sectors]="sectors"
          (save)="onSave($event)">
        </app-req-specs-project-form>
      </ng-container>

      <ng-container *ngIf="!project">
        <div class="alert alert-info">Loading project form...</div>
      </ng-container>
    </div>
  `
})
export class ReqSpecsAddProjectComponent implements OnInit {
  project!: ReqSpecsProject;
  companies: Company[] = [];
  sectors: Sector[] = [];

  constructor(
    private reqSpecsService: ReqSpecsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    await this.reqSpecsService.loadCompanies();
    this.companies = this.reqSpecsService.companies();
    this.sectors = this.reqSpecsService.sectors();

    if (id) {
      const existing = await this.reqSpecsService.getProjectById(id);
      if (existing) {
        this.project = existing;
        return;
      }
    }

    this.project = {
      id: '',
      title: '',
      description: '',
      companyId: '',
      sector: '',
      startDate: '',
      endDate: '',
      status: 'draft',
      createdAt: new Date().toISOString(),
      createdBy: 'unknown',
      stakeholders: [],
      specs: []
    };
  }

  async onSave(updated: ReqSpecsProject) {
    await this.reqSpecsService.saveProject(updated);
    alert('Project saved successfully');
    this.router.navigate(['/requirements-specs']);
  }
}
