import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ReqSpecsProject,
  Status,
  StandardRef,
  UserRef,
  ISODate,
} from './req-specs.types';
import { Company, Sector } from '../core/general/general.types';

@Component({
  selector: 'app-req-specs-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" class="p-4 border rounded bg-light">
      <!-- Name -->
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input class="form-control" [(ngModel)]="vm.name" name="name" required />
      </div>

      <!-- Description -->
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea class="form-control" [(ngModel)]="vm.description" name="description" rows="3"></textarea>
      </div>

      <!-- Company / Sector -->
      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <label class="form-label">Company</label>
          <select class="form-select" [(ngModel)]="vm.companyId" name="companyId">
            <option [ngValue]="undefined">-- Select Company --</option>
            <option *ngFor="let c of companies" [ngValue]="c.id">{{ c.name }}</option>
          </select>
        </div>

        <div class="col-md-6">
          <label class="form-label">Sector</label>
          <select class="form-select" [(ngModel)]="vm.sectorId" name="sectorId">
            <option [ngValue]="undefined">-- Select Sector --</option>
            <option *ngFor="let s of sectors" [ngValue]="s.id">{{ s.name }}</option>
          </select>
        </div>
      </div>

      <!-- Deadline / Status -->
      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <label class="form-label">Deadline</label>
          <input type="date" class="form-control" [(ngModel)]="deadlineLocal" name="deadlineLocal" />
          <div class="form-text">Optional target date for SRS completion.</div>
        </div>

        <div class="col-md-6">
          <label class="form-label">Status</label>
          <select class="form-select" [(ngModel)]="vm.status" name="status" required>
            <option *ngFor="let s of statuses" [ngValue]="s">{{ s }}</option>
          </select>
        </div>
      </div>

      <!-- Stakeholders -->
      <div class="mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <label class="form-label mb-0">Stakeholders</label>
          <button type="button" class="btn btn-sm btn-outline-primary" (click)="addStakeholder()">Add</button>
        </div>
        <div *ngIf="vm.stakeholders?.length === 0 || !vm.stakeholders" class="form-text">No stakeholders added.</div>

        <div *ngFor="let st of vm.stakeholders; let i = index" class="border rounded p-2 mt-2">
          <div class="row g-2">
            <div class="col-md-4">
              <input class="form-control" [(ngModel)]="st.name" name="st_name_{{i}}" placeholder="Name" />
            </div>
            <div class="col-md-4">
              <input class="form-control" [(ngModel)]="st.role" name="st_role_{{i}}" placeholder="Role" />
            </div>
            <div class="col-md-3">
              <input class="form-control" [(ngModel)]="st.contact" name="st_contact_{{i}}" placeholder="Contact" />
            </div>
            <div class="col-md-1 d-grid">
              <button type="button" class="btn btn-outline-danger" (click)="removeStakeholder(i)">&times;</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Standards -->
      <div class="mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <label class="form-label mb-0">Standards</label>
          <button type="button" class="btn btn-sm btn-outline-primary" (click)="addStandard()">Add</button>
        </div>
        <div *ngIf="standards.length === 0" class="form-text">No standards added.</div>

        <div *ngFor="let s of standards; let i = index" class="border rounded p-2 mt-2">
          <div class="row g-2">
            <div class="col-md-5">
              <input class="form-control" [(ngModel)]="s.code" name="std_code_{{i}}" placeholder="Code (e.g., ISO/IEC/IEEE 29148:2018)" />
            </div>
            <div class="col-md-3">
              <input class="form-control" [(ngModel)]="s.clause" name="std_clause_{{i}}" placeholder="Clause (e.g., 5.2.3)" />
            </div>
            <div class="col-md-3">
              <input class="form-control" [(ngModel)]="s.note" name="std_note_{{i}}" placeholder="Note" />
            </div>
            <div class="col-md-1 d-grid">
              <button type="button" class="btn btn-outline-danger" (click)="removeStandard(i)">&times;</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tags -->
      <div class="mb-3">
        <label class="form-label">Tags (comma/space separated)</label>
        <input class="form-control" [(ngModel)]="tagsText" name="tagsText" placeholder="quality security performance ..." />
      </div>

      <div class="text-end">
        <button class="btn btn-outline-secondary me-2" type="button" (click)="resetToModel()">Reset</button>
        <button class="btn btn-primary" type="submit" [disabled]="!formValid()">Save</button>
      </div>
    </form>
  `
})
export class ReqSpecsProjectFormComponent {
  @Input() project?: Partial<ReqSpecsProject>;  // incoming model (edit mode)
  @Input() companies: Company[] = [];
  @Input() sectors: Sector[] = [];
  @Input() currentUser?: UserRef;               // used for createdBy if missing

  @Output() save = new EventEmitter<ReqSpecsProject>();

  // Internal VM bound to the template; kept partial for flexibility
  vm: Partial<ReqSpecsProject> = {};

  // Dynamic lists
  standards: StandardRef[] = [];

  // Select options
  statuses: Status[] = ['draft', 'in-review', 'approved', 'deprecated'];

  // Text buffers
  tagsText = '';
  deadlineLocal = ''; // yyyy-mm-dd for <input type="date">

  ngOnInit() {
    this.vm = this.mergeModel(this.project);
    this.standards = [...(this.project?.standards ?? [])];

    // Tags as text
    this.tagsText = (this.project?.tags ?? []).join(' ');

    // Convert ISO deadlineAt to yyyy-mm-dd local string
    if (this.project?.deadlineAt) {
      try {
        const d = new Date(this.project.deadlineAt);
        if (!isNaN(d.getTime())) {
          this.deadlineLocal = d.toISOString().slice(0, 10);
        }
      } catch { /* noop */ }
    }
  }

  // --- Helpers ---------------------------------------------------------------

  /** Returns ISO string of now */
  private now(): ISODate {
    return new Date().toISOString();
  }

  /** Normalizes string: trim & collapse whitespace */
  private norm(s?: string): string | undefined {
    if (s == null) return undefined;
    const t = s.trim();
    return t.length ? t : undefined;
  }

  /** Parses ids/tags separated by comma/space */
  private parseList(s?: string): string[] | undefined {
    if (!s) return undefined;
    const arr = s.split(/[\s,]+/g).map(v => v.trim()).filter(Boolean);
    return arr.length ? arr : undefined;
  }

  /** Creates a clean partial VM from incoming model */
  private mergeModel(src?: Partial<ReqSpecsProject>): Partial<ReqSpecsProject> {
    return {
      id: src?.id ?? '',
      name: this.norm(src?.name) ?? '',
      description: this.norm(src?.description),
      companyId: src?.companyId,
      sectorId: src?.sectorId,
      status: (src?.status ?? 'draft') as Status,
      stakeholders: src?.stakeholders ?? [],
      // standards handled via dedicated array
      // tags handled via text buffer
      deadlineAt: src?.deadlineAt,
      createdBy: src?.createdBy ?? this.currentUser,
      createdAt: src?.createdAt,
      updatedAt: src?.updatedAt,
    };
  }

  // --- Dynamic lists: stakeholders & standards -------------------------------

  addStakeholder(): void {
    const list = this.vm.stakeholders ?? [];
    this.vm.stakeholders = [...list, { name: '', role: '', contact: '' }];
  }

  removeStakeholder(i: number): void {
    if (!this.vm.stakeholders) return;
    this.vm.stakeholders = this.vm.stakeholders.filter((_, idx) => idx !== i);
  }

  addStandard(): void {
    this.standards = [...this.standards, { code: '' }];
  }

  removeStandard(i: number): void {
    this.standards = this.standards.filter((_, idx) => idx !== i);
  }

  // --- Validation / reset / submit ------------------------------------------

  /** Minimal synchronous validation */
  formValid(): boolean {
    return !!this.vm.name && !!this.vm.status;
  }

  /** Reset form back to original model */
  resetToModel(): void {
    this.vm = this.mergeModel(this.project);
    this.standards = [...(this.project?.standards ?? [])];
    this.tagsText = (this.project?.tags ?? []).join(' ');
    this.deadlineLocal = '';
    if (this.project?.deadlineAt) {
      try {
        const d = new Date(this.project.deadlineAt);
        if (!isNaN(d.getTime())) this.deadlineLocal = d.toISOString().slice(0, 10);
      } catch { /* noop */ }
    }
  }

  /** Emit sanitized payload */
  onSubmit(): void {
    // Normalize text fields
    const name = this.norm(this.vm.name) ?? '';
    const description = this.norm(this.vm.description);

    // Clean stakeholders (drop empty rows)
    const stakeholders = (this.vm.stakeholders ?? [])
      .map(st => ({
        name: this.norm(st.name),
        role: this.norm(st.role),
        contact: this.norm(st.contact),
      }))
      .filter(st => !!st.name);

    // Clean standards (drop empty rows)
    const stds = this.standards
      .map(s => ({
        code: this.norm(s.code),
        clause: this.norm(s.clause),
        note: this.norm(s.note),
      }))
      .filter(s => !!s.code) as StandardRef[];

    // Parse tags
    const tags = this.parseList(this.tagsText);

    // Convert date to ISO
    let deadlineAt: ISODate | undefined = undefined;
    if (this.deadlineLocal) {
      try {
        // Store as start-of-day UTC to keep a stable ISO value
        deadlineAt = new Date(this.deadlineLocal + 'T00:00:00.000Z').toISOString();
      } catch { /* noop */ }
    }

    const now = this.now();
    const createdAt = this.project?.createdAt ?? now;

    const payload: ReqSpecsProject = {
      id: this.project?.id ?? '',                    // service will generate if empty
      name,
      description,
      companyId: this.vm.companyId || undefined,
      sectorId: this.vm.sectorId || undefined,
      stakeholders: stakeholders.length ? stakeholders as any : undefined,
      standards: stds.length ? stds : undefined,
      tags: tags?.length ? tags : undefined,
      status: (this.vm.status as Status) ?? 'draft',
      deadlineAt,
      createdBy: this.project?.createdBy ?? this.currentUser ?? { uid: 'unknown' },
      createdAt,
      updatedAt: now,
    };

    // Drop undefined optionals to keep document tidy
    if (!payload.description) delete (payload as any).description;
    if (!payload.companyId) delete (payload as any).companyId;
    if (!payload.sectorId) delete (payload as any).sectorId;
    if (!payload.stakeholders?.length) delete (payload as any).stakeholders;
    if (!payload.standards?.length) delete (payload as any).standards;
    if (!payload.tags?.length) delete (payload as any).tags;
    if (!payload.deadlineAt) delete (payload as any).deadlineAt;

    this.save.emit(payload);
  }
}
