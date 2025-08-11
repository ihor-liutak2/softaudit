// src/app/requirements_specs/req-specs-add-project.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ReqSpecsService } from './req-specs.service';
import { ReqSpecsProject, UserRef } from './req-specs.types';
import { Company, Sector } from '../core/general/general.types';
import { ReqSpecsProjectFormComponent } from './req-specs-project-form.component';
import { UserService } from '../core/user/user.service';

@Component({
  selector: 'app-req-specs-add-project',
  standalone: true,
  imports: [CommonModule, ReqSpecsProjectFormComponent],
  template: `
    <div class="container py-4">
      <h3 class="mb-3">Add / Edit Requirements Project</h3>

      @if (project) {
        <app-req-specs-project-form
          [model]="project"
          [companies]="companies"
          [sectors]="sectors"
          [createdBy]="currentUserRef"
          (save)="onSave($event)">
        </app-req-specs-project-form>
      } @else {
        <div class="alert alert-info">Loading project form...</div>
      }
    </div>
  `
})
export class ReqSpecsAddProjectComponent implements OnInit {
  private readonly reqSpecs = inject(ReqSpecsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  project: ReqSpecsProject | undefined;
  companies: Company[] = [];
  sectors: Sector[] = [];
  currentUserRef: UserRef | undefined;

  async ngOnInit(): Promise<void> {
    // Map current auth user -> UserRef (uid/name/email)
    const u = this.userService.user;
    this.currentUserRef = u
      ? { uid: u.uid, name: u.displayName ?? undefined, email: u.email ?? undefined }
      : undefined;

    // Load reference data
    await this.reqSpecs.loadCompanies();
    this.companies = this.reqSpecs.companies();
    this.sectors = this.reqSpecs.sectors();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const existing = await this.reqSpecs.getProjectById(id);
      if (existing) {
        this.project = existing;
        return;
      }
    }

    // New project default (no undefined fields for Firestore)
    this.project = {
      id: '',
      name: '',
      description: '',
      companyId: '',
      sectorId: '',
      stakeholders: [],
      standards: undefined,
      tags: undefined,
      status: 'draft',
      deadlineAt: undefined,
      createdBy: this.currentUserRef ?? { uid: 'anonymous' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async onSave(updated: ReqSpecsProject) {
    await this.reqSpecs.saveProject(updated);
    alert('Project saved successfully');
    this.router.navigate(['/req-specs']);
  }
}
