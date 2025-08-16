// src/app/requirements_specs/req-specs-project-form.component.ts
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReqSpecsProject, StandardRef, UserRef } from './req-specs.types';
import { Company, Sector } from '../core/general/general.types';
import { StandardsCatalogService } from './standards-catalog.service';

type StakeholderRow = { name: string; role?: string; contact?: string };
type Status = ReqSpecsProject['status'];

@Component({
  selector: 'app-req-specs-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="submit()" class="p-4 border rounded bg-light">
      <!-- Basic -->
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Name *</label>
          <input class="form-control" [(ngModel)]="name" name="name" required />
        </div>

        <div class="col-md-3">
          <label class="form-label">Company</label>
          <select class="form-select" [(ngModel)]="companyId" name="companyId">
            <option [ngValue]="''">—</option>
            @for (c of companies; track c.id) {
              <option [ngValue]="c.id">{{ c.name }}</option>
            }
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label">Sector</label>
          <select class="form-select" [(ngModel)]="sectorId" name="sectorId">
            <option [ngValue]="''">—</option>
            @for (s of sectors; track s.id) {
              <option [ngValue]="s.id">{{ s.name }}</option>
            }
          </select>
        </div>
      </div>

      <div class="mt-3">
        <label class="form-label">Description</label>
        <textarea class="form-control" [(ngModel)]="description" name="description" rows="3"></textarea>
      </div>

      <!-- Status & deadline -->
      <div class="row g-3 mt-1">
        <div class="col-md-3">
          <label class="form-label">Status *</label>
          <select class="form-select" [(ngModel)]="status" name="status" required>
            <option [ngValue]="'draft'">draft</option>
            <option [ngValue]="'in-review'">in-review</option>
            <option [ngValue]="'approved'">approved</option>
            <option [ngValue]="'archived'">archived</option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label">Deadline</label>
          <input type="date" class="form-control" [(ngModel)]="deadlineAt" name="deadlineAt" />
        </div>
      </div>

      <!-- Estimation settings -->
      <div class="row g-3 mt-3">
        <div class="col-md-4">
          <label class="form-label">Estimation mode</label>
          <select class="form-select" [(ngModel)]="estimationMode" name="estimationMode">
            <option [ngValue]="'points'">Story points</option>
            <option [ngValue]="'time'">Hours</option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Velocity (pts/sprint)</label>
          <input type="number" class="form-control"
                [(ngModel)]="velocityPtsPerSprint" name="velocityPtsPerSprint" />
        </div>
        <div class="col-md-4">
          <label class="form-label">Capacity (hours/sprint)</label>
          <input type="number" class="form-control"
                [(ngModel)]="capacityHoursPerSprint" name="capacityHoursPerSprint" />
        </div>
      </div>


      <!-- Stakeholders -->
      <div class="mt-4">
        <div class="d-flex justify-content-between align-items-center">
          <label class="form-label mb-0">Stakeholders</label>
          <button type="button" class="btn btn-sm btn-outline-secondary" (click)="addStakeholder()">
            <i class="bi bi-plus-lg"></i> Add
          </button>
        </div>

        <div class="table-responsive mt-2">
          <table class="table table-sm align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 40%">Name</th>
                <th style="width: 30%">Role</th>
                <th style="width: 25%">Contact</th>
                <th style="width: 5%"></th>
              </tr>
            </thead>
            <tbody>
              @for (row of stakeholders(); track $index; let i = $index) {
                <tr>
                  <td><input class="form-control" [(ngModel)]="row.name" [name]="'sh_name_' + i" /></td>
                  <td><input class="form-control" [(ngModel)]="row.role" [name]="'sh_role_' + i" /></td>
                  <td><input class="form-control" [(ngModel)]="row.contact" [name]="'sh_contact_' + i" /></td>
                  <td class="text-end">
                    <button type="button" class="btn btn-sm btn-outline-danger" (click)="removeStakeholder(i)">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </td>
                </tr>
              }
              @empty {
                <tr><td colspan="4" class="text-muted text-center">No stakeholders</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tags -->
      <div class="mt-3">
        <label class="form-label">Tags</label>
        <div class="d-flex gap-2">
          <input class="form-control" [(ngModel)]="tagInput" name="tagInput" (keydown.enter)="addTag(); $event.preventDefault();" placeholder="Type tag and press Enter" />
          <button type="button" class="btn btn-outline-secondary" (click)="addTag()">Add</button>
        </div>

        <div class="mt-2">
          @for (t of tags(); track t) {
            <span class="badge text-bg-secondary me-2">
              {{ t }}
              <button type="button" class="btn-close btn-close-white btn-sm ms-1" aria-label="Remove" (click)="removeTag(t)"></button>
            </span>
          }
          @empty {
            <span class="text-muted">No tags</span>
          }
        </div>
      </div>

      <!-- Project standards (manual list) -->
      <div class="mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <label class="form-label mb-0">Project standards</label>
          <button type="button" class="btn btn-sm btn-outline-primary" (click)="projectStandards.push({ code: '' })">
            Add
          </button>
        </div>

        @if (projectStandards.length === 0) {
          <div class="form-text">No standards added.</div>
        }

        @for (s of projectStandards; track $index; let i = $index) {
          <div class="border rounded p-2 mt-2">
            <div class="row g-2">
              <div class="col-md-4">
                <input class="form-control"
                       [(ngModel)]="s.code"
                       [name]="'pstd_code_' + i"
                       placeholder="Code (e.g., ISO/IEC 25010)" />
              </div>
              <div class="col-md-4">
                <input class="form-control"
                       [(ngModel)]="s.clause"
                       [name]="'pstd_clause_' + i"
                       placeholder="Clause (e.g., PE.TimeBehavior)" />
              </div>
              <div class="col-md-3">
                <input class="form-control"
                       [(ngModel)]="s.note"
                       [name]="'pstd_note_' + i"
                       placeholder="Note" />
              </div>
              <div class="col-md-1 d-grid">
                <button type="button" class="btn btn-outline-danger" (click)="removeProjectStd(i)">&times;</button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Catalog picker (helper; visually narrower/indented) -->
      <div class="ps-3 ms-1 border-start border-2 mb-3">
        <label class="form-label">Standards (catalog)</label>
        <div class="row g-2 align-items-end">
          <div class="col-md-5">
            <select class="form-select"
                    [(ngModel)]="selStdId"
                    [ngModelOptions]="{standalone: true}">
              <option [ngValue]="undefined">— choose standard —</option>
              @for (s of catalog.standards(); track s.id) {
                <option [value]="s.id">{{ s.code }} — {{ s.title }}</option>
              }
            </select>
          </div>

          <div class="col-md-5">
            <select class="form-select"
                    [(ngModel)]="selClauseId"
                    [ngModelOptions]="{standalone: true}"
                    [disabled]="!selStdId">
              <option [ngValue]="undefined">— choose clause —</option>
              @for (c of catalog.clausesOf(selStdId!); track c.id) {
                <option [value]="c.id">{{ c.code }} — {{ c.title }}</option>
              }
            </select>
          </div>

          <div class="col-md-2 d-grid">
            <button type="button"
                    class="btn btn-outline-primary"
                    [disabled]="!selStdId || !selClauseId"
                    (click)="addProjectStdFromCatalog()">
              Add
            </button>
          </div>
        </div>
      </div>

      <!-- System info -->
      <div class="mt-4 small text-muted">
        <div>Created by: {{ createdByLabel() }}</div>
        <div>Created: {{ createdAt || '—' }}</div>
        <div>Updated: {{ updatedAt || '—' }}</div>
      </div>

      <div class="text-end mt-4">
        <button class="btn btn-primary" type="submit" [disabled]="!isValid()">Save</button>
      </div>
    </form>
  `
})
export class ReqSpecsProjectFormComponent {
  // Inputs
  @Input() model?: Partial<ReqSpecsProject>;
  @Input() companies: Company[] = [];
  @Input() sectors: Sector[] = [];
  @Input() createdBy?: UserRef; // parent should pass current user

  // Outputs
  @Output() save = new EventEmitter<ReqSpecsProject>();

  // Local state (form controls)
  id = '';
  name = '';
  description = '';
  companyId: string = '';
  sectorId: string = '';
  status: Status = 'draft';
  deadlineAt: string = ''; // yyyy-mm-dd for <input type="date">
  /** Estimation settings for this project */
  estimationMode: 'points' | 'time' = 'points';
  velocityPtsPerSprint?: number;
  capacityHoursPerSprint?: number;
  sprintLengthDays?: number;


  createdAt = '';
  updatedAt = '';

  stakeholders = signal<StakeholderRow[]>([]);
  tagInput = '';
  tags = signal<string[]>([]);

  // Project-level standards edited in this form
  projectStandards: StandardRef[] = [];

  // Catalog helper selections (NOT part of form)
  selStdId?: string;
  selClauseId?: string;

  constructor(public catalog: StandardsCatalogService) {}

  // Initialize from model
  async ngOnInit() {
    const m = this.model ?? {};

    this.id = m.id ?? '';
    this.name = m.name ?? '';
    this.description = m.description ?? '';
    this.companyId = m.companyId ?? '';
    this.sectorId = m.sectorId ?? '';
    this.status = (m.status as Status) ?? 'draft';
    this.deadlineAt = m.deadlineAt ? this.toDateInput(m.deadlineAt) : '';

    this.createdAt = m.createdAt ?? new Date().toISOString();
    this.updatedAt = m.updatedAt ?? new Date().toISOString();

    this.stakeholders.set(
      (m.stakeholders?.map(s => ({ name: s.name ?? '', role: s.role, contact: s.contact })) ?? [])
    );

    this.tags.set([...(m.tags ?? [])]);

    // Estimation settings (new)
    this.estimationMode = (m.estimationMode as any) ?? 'points';
    this.velocityPtsPerSprint = m.velocityPtsPerSprint;
    this.capacityHoursPerSprint = m.capacityHoursPerSprint;
    this.sprintLengthDays = m.sprintLengthDays;

    // Initialize local standards array from model
    this.projectStandards = [...(m.standards ?? [])];

    // Load catalog once
    await this.catalog.load();
  }

  // Basic validation (required: name, status)
  isValid(): boolean {
    return !!this.name && !!this.status;
  }

  // Submit → emit normalized ReqSpecsProject
  submit() {
    if (!this.isValid()) return;

    const nowIso = new Date().toISOString();
    const uid = this.id || crypto.randomUUID();

    // Compact stakeholders: remove empty rows
    const sh = this.stakeholders()
      .map(r => ({
        name: r.name?.trim(),
        role: r.role?.trim() || undefined,
        contact: r.contact?.trim() || undefined
      }))
      .filter(r => !!r.name) as StakeholderRow[];

    // Build clean payload without undefined (Firestore-safe)
    const payload: ReqSpecsProject = this.compact<ReqSpecsProject>({
      id: uid,
      name: this.name.trim(),
      description: this.description?.trim() || undefined,
      companyId: this.companyId || undefined,
      sectorId: this.sectorId || undefined,
      stakeholders: sh.length ? sh : undefined,
      standards: this.projectStandards.length ? this.projectStandards : undefined,
      tags: this.tags().length ? this.tags() : undefined,
      status: this.status,
      deadlineAt: this.deadlineAt ? this.fromDateInput(this.deadlineAt) : undefined,
      createdBy: this.model?.createdBy ?? this.createdBy ?? { uid: 'unknown' },
      createdAt: this.model?.createdAt ?? this.createdAt ?? nowIso,
      updatedAt: nowIso,

      // Estimation settings (new)
      estimationMode: this.estimationMode || undefined,
      velocityPtsPerSprint: this.velocityPtsPerSprint,
      capacityHoursPerSprint: this.capacityHoursPerSprint,
      sprintLengthDays: this.sprintLengthDays
    });

    this.save.emit(payload);
  }

  /** Stakeholders */
  addStakeholder() {
    this.stakeholders.update(list => [...list, { name: '', role: '', contact: '' }]);
  }
  removeStakeholder(i: number) {
    this.stakeholders.update(list => list.filter((_, idx) => idx !== i));
  }

  /** Tags */
  addTag() {
    const t = (this.tagInput || '').trim();
    if (!t) return;
    if (!this.tags().includes(t)) this.tags.update(arr => [...arr, t]);
    this.tagInput = '';
  }
  removeTag(tag: string) {
    this.tags.update(arr => arr.filter(x => x !== tag));
  }

  /** Render createdBy label */
  createdByLabel(): string {
    const u = this.model?.createdBy ?? this.createdBy;
    if (!u) return '—';
    return (u as any).name ?? (u as any).email ?? (u as any).uid ?? '—';
  }

  /** Utilities */

  // Remove undefined, empty string and empty arrays from object
  private compact<T extends Record<string, any>>(obj: T): T {
    const out: any = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v === undefined || v === null) continue;
      if (typeof v === 'string' && v.trim() === '') continue;
      if (Array.isArray(v) && v.length === 0) continue;
      out[k] = v;
    }
    return out as T;
  }

  // Convert ISO date string → input[type=date] (yyyy-mm-dd)
  private toDateInput(iso: string): string {
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return '';
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    } catch {
      return '';
    }
  }

  // Convert input[type=date] → ISO
  private fromDateInput(val: string): string {
    if (!val) return '';
    return new Date(`${val}T00:00:00.000Z`).toISOString();
  }

  /** Add selected clause from catalog into project's standards */
  addProjectStdFromCatalog(): void {
    if (!this.selStdId || !this.selClauseId) return;

    const std = this.catalog.standardById(this.selStdId);
    const clause = this.catalog.clauseById(this.selStdId, this.selClauseId);
    if (!std || !clause) return;

    // De-dup by (code+clause)
    const exists = this.projectStandards.some(s => s.code === std.code && s.clause === clause.code);
    if (exists) return;

    this.projectStandards.push({
      code: std.code,
      clause: clause.code,
      note: clause.title
    });

    // Reset helper clause; keep standard for quick multiple additions
    this.selClauseId = undefined;
  }

  removeProjectStd(idx: number): void {
    this.projectStandards.splice(idx, 1);
  }
}
