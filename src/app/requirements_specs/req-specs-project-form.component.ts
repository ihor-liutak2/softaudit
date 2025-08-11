// src/app/requirements_specs/req-specs-project-form.component.ts
import { Component, EventEmitter, Input, Output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReqSpecsProject, UserRef } from './req-specs.types';
import { Company, Sector } from '../core/general/general.types';

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
              @for (row of stakeholders(); track $index) {
                <tr>
                  <td><input class="form-control" [(ngModel)]="row.name" name="sh_name_{{ $index }}" /></td>
                  <td><input class="form-control" [(ngModel)]="row.role" name="sh_role_{{ $index }}" /></td>
                  <td><input class="form-control" [(ngModel)]="row.contact" name="sh_contact_{{ $index }}" /></td>
                  <td class="text-end">
                    <button type="button" class="btn btn-sm btn-outline-danger" (click)="removeStakeholder($index)">
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
  deadlineAt: string = ''; // ISO date (yyyy-mm-dd) for <input type="date">

  createdAt = '';
  updatedAt = '';

  stakeholders = signal<StakeholderRow[]>([]);
  tagInput = '';
  tags = signal<string[]>([]);

  // Initialize from model
  ngOnInit() {
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
      // standards are not edited in this form for now; leave as-is from model if present
      standards: (this.model?.standards && this.model!.standards!.length) ? this.model!.standards : undefined,
      tags: this.tags().length ? this.tags() : undefined,
      status: this.status,
      deadlineAt: this.deadlineAt ? this.fromDateInput(this.deadlineAt) : undefined,
      createdBy: this.model?.createdBy ?? this.createdBy!, // parent should pass createdBy
      createdAt: this.model?.createdAt ?? this.createdAt ?? nowIso,
      updatedAt: nowIso
    });

    this.save.emit(payload);
  }

  /** Add/remove stakeholders */
  addStakeholder() {
    this.stakeholders.update(list => [...list, { name: '', role: '', contact: '' }]);
  }
  removeStakeholder(i: number) {
    this.stakeholders.update(list => list.filter((_, idx) => idx !== i));
  }

  /** Add/remove tags */
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

  // Convert ISO date string → input[type=date] value (yyyy-mm-dd)
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

  // Convert input[type=date] value → ISO (yyyy-mm-dd -> yyyy-mm-ddT00:00:00.000Z)
  private fromDateInput(val: string): string {
    if (!val) return '';
    // Interpret as UTC midnight to be stable
    return new Date(`${val}T00:00:00.000Z`).toISOString();
    // If you prefer local date start, use new Date(val).toISOString()
  }
}
