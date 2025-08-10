import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReqSpecsService } from './req-specs.service';
import { ReqSpecsProject, UserRef } from './req-specs.types';
import { Company, Sector } from '../core/general/general.types';
import { ReqSpecsProjectFormComponent } from './req-specs-project-form.component';
import { UserService } from '../core/user/user.service';
import { AppUser } from '../core/user/user.model';

@Component({
  selector: 'app-req-specs-add-project',
  standalone: true,
  imports: [CommonModule, ReqSpecsProjectFormComponent],
  template: `
    <div class="container py-4">
      <h3 class="mb-3">Add / Edit Requirements Project</h3>

      <ng-container *ngIf="project; else loading">
        <app-req-specs-project-form
          [project]="project"
          [companies]="companies"
          [sectors]="sectors"
          [currentUser]="currentUserRef"
          (save)="onSave($event)">
        </app-req-specs-project-form>
      </ng-container>

      <ng-template #loading>
        <div class="alert alert-info">Loading project form...</div>
      </ng-template>
    </div>
  `
})
export class ReqSpecsAddProjectComponent implements OnInit {
  private readonly reqSpecsService = inject(ReqSpecsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  project!: ReqSpecsProject;
  companies: Company[] = [];
  sectors: Sector[] = [];
  currentUserRef?: UserRef;

  async ngOnInit(): Promise<void> {
    // Map current auth user -> UserRef (uid/name/email)
    const u = this.userService.user;
    this.currentUserRef = u ? this.toUserRef(u) : undefined;

    // Preload selects
    await this.reqSpecsService.loadCompanies();
    this.companies = this.reqSpecsService.companies();
    this.sectors = this.reqSpecsService.sectors();

    // Edit mode: try load existing
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    if (id) {
      const existing = await this.reqSpecsService.getProjectById(id);
      if (existing) {
        this.project = existing;
        return;
      }
    }

    // New draft project
    const now = new Date().toISOString();
    this.project = {
      id: '',
      name: '',
      description: undefined,
      companyId: undefined,
      sectorId: undefined,
      stakeholders: [],
      standards: undefined,
      tags: undefined,
      status: 'draft',
      deadlineAt: undefined,
      createdBy: this.currentUserRef ?? { uid: 'unknown' },
      createdAt: now,
      updatedAt: now,
    };
  }

  async onSave(updated: ReqSpecsProject) {
    try {
      const clean = { ...updated } as any;
      if (!clean.id || !String(clean.id).trim()) {
        delete clean.id; // <- дозволяємо сервісу згенерувати id
      }

      const id = await this.reqSpecsService.saveProject(clean as ReqSpecsProject);
      alert('Project saved successfully');
      this.router.navigate(['/req-specs/project', id]);
    } catch (e: any) {
      console.error('[ReqSpecsAddProjectComponent] save failed', e);
      alert('Failed to save project: ' + (e?.message ?? e));
    }
  }


  // Build a UserRef without undefined fields
  private toUserRef(u: AppUser): UserRef {
    return {
      uid: u.uid,
      ...(u.displayName ? { name: u.displayName } : {}),
      ...(u.email ? { email: u.email } : {}),
    };
  }
}
