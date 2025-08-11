// src/app/requirements_specs/req-specs-item-form.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ReqSpecsItem,
  RequirementType,
  Priority,
  Status,
  StandardRef,
  UserRef,
  Id,
  ISODate,
} from './req-specs.types';

// src/app/requirements_specs/req-specs-item-form.component.ts
// ...imports ті самі

@Component({
  selector: 'app-req-specs-item-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="submit()" class="p-3 border rounded bg-light">

      <!-- Optional parent info (read-only) -->
      @if (parentId) {
        <div class="mb-2">
          <span class="small text-muted">Parent:</span>
          <span class="badge bg-light text-dark ms-1">{{ parentLabel || parentId }}</span>
        </div>
      }

      <!-- Title -->
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input class="form-control" [(ngModel)]="item.title" name="title" required />
      </div>

      <!-- Description -->
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea class="form-control" [(ngModel)]="item.description" name="description" rows="3"></textarea>
      </div>

      <!-- Type / Priority / Status -->
      <div class="row g-3 mb-3">
        <div class="col-md-4">
          <label class="form-label">Type</label>
          <select class="form-select" [(ngModel)]="item.type" name="type" required>
            @for (t of requirementTypes; track t) { <option [value]="t">{{ t }}</option> }
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Priority</label>
          <select class="form-select" [(ngModel)]="item.priority" name="priority" required>
            @for (p of priorities; track p) { <option [value]="p">{{ p }}</option> }
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label">Status</label>
          <select class="form-select" [(ngModel)]="item.status" name="status" required>
            @for (s of statuses; track s) { <option [value]="s">{{ s }}</option> }
          </select>
        </div>
      </div>

      <!-- Acceptance Criteria -->
      <div class="mb-3">
        <label class="form-label">Acceptance Criteria (one per line)</label>
        <textarea class="form-control"
                  [(ngModel)]="acceptanceCriteriaText"
                  name="acceptanceCriteria"
                  rows="4"
                  placeholder="- System shall ...&#10;- Response time ..."></textarea>
        <div class="form-text">Each non-empty line will be saved as a separate acceptance criterion.</div>
      </div>

      <!-- Rationale / Source -->
      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <label class="form-label">Rationale</label>
          <textarea class="form-control" [(ngModel)]="item.rationale" name="rationale" rows="2"></textarea>
        </div>
        <div class="col-md-6">
          <label class="form-label">Source</label>
          <input class="form-control" [(ngModel)]="item.source" name="source" />
        </div>
      </div>

      <!-- Order (keep editable if you want manual ordering) -->
      <div class="mb-3">
        <label class="form-label">Order (optional)</label>
        <input type="number" class="form-control" [(ngModel)]="item.order" name="order" />
      </div>

      <!-- Standards -->
      <div class="mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <label class="form-label mb-0">Standards</label>
          <button type="button" class="btn btn-sm btn-outline-primary" (click)="addStandard()">Add</button>
        </div>
        @if (standards.length === 0) { <div class="form-text">No standards added.</div> }
        @for (s of standards; track $index; let i = $index) {
          <div class="border rounded p-2 mt-2">
            <div class="row g-2">
              <div class="col-md-4">
                <input class="form-control" [(ngModel)]="s.code" [attr.name]="'std_code_' + i" placeholder="Code (e.g., ISO/IEC 29148:2018)" />
              </div>
              <div class="col-md-3">
                <input class="form-control" [(ngModel)]="s.clause" [attr.name]="'std_clause_' + i" placeholder="Clause (e.g., 5.2.3)" />
              </div>
              <div class="col-md-4">
                <input class="form-control" [(ngModel)]="s.note" [attr.name]="'std_note_' + i" placeholder="Note" />
              </div>
              <div class="col-md-1 d-grid">
                <button type="button" class="btn btn-outline-danger" (click)="removeStandard(i)">&times;</button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Links -->
      <div class="mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <label class="form-label mb-0">Links</label>
          <button type="button" class="btn btn-sm btn-outline-primary" (click)="addLink()">Add</button>
        </div>
        @if (links.length === 0) { <div class="form-text">No links added.</div> }
        @for (l of links; track $index; let i = $index) {
          <div class="border rounded p-2 mt-2">
            <div class="row g-2">
              <div class="col-md-5">
                <input class="form-control" [(ngModel)]="l.title" [attr.name]="'link_title_' + i" placeholder="Title" />
              </div>
              <div class="col-md-6">
                <input class="form-control" [(ngModel)]="l.url" [attr.name]="'link_url_' + i" placeholder="URL" />
              </div>
              <div class="col-md-1 d-grid">
                <button type="button" class="btn btn-outline-danger" (click)="removeLink(i)">&times;</button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Related / Tags -->
      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <label class="form-label">Related IDs (comma/space separated)</label>
          <input class="form-control" [(ngModel)]="relatedText" name="related" placeholder="id1, id2 id3" />
        </div>
        <div class="col-md-6">
          <label class="form-label">Tags (comma/space separated)</label>
          <input class="form-control" [(ngModel)]="tagsText" name="tags" placeholder="performance security ..." />
        </div>
      </div>

      <div class="text-end">
        <button class="btn btn-outline-secondary me-2" type="button" (click)="resetToModel()">Reset</button>
        <button class="btn btn-outline-success" type="submit" [disabled]="!formValid()">Save</button>
      </div>
    </form>
  `
})
export class ReqSpecsItemFormComponent {
  @Input() model?: Partial<ReqSpecsItem>;
  @Input() projectId!: Id;
  @Input() createdBy!: UserRef;
  @Input() parentId?: Id;            // passed from context (query param / menu)
  @Input() parentLabel?: string;     // optional pretty label for parent

  @Output() saved = new EventEmitter<ReqSpecsItem>();

  requirementTypes: RequirementType[] = ['functional', 'nonfunctional', 'constraint', 'glossary'];
  priorities: Priority[] = ['must', 'should', 'could', 'wont'];
  statuses: Status[] = ['draft', 'in-review', 'approved', 'deprecated'];

  item!: ReqSpecsItem;
  standards: StandardRef[] = [];
  links: Array<{ title: string; url: string }> = [];
  acceptanceCriteriaText = '';
  relatedText = '';
  tagsText = '';

  ngOnInit() {
    this.item = this.mergeModel(this.model);
    this.standards = [...(this.model?.standards ?? [])];
    this.links = [...(this.model?.links ?? [])];
    this.acceptanceCriteriaText = (this.model?.acceptanceCriteria ?? []).join('\n');
    this.relatedText = (this.model?.related ?? []).join(' ');
    this.tagsText = (this.model?.tags ?? []).join(' ');
  }

  /** Returns ISO string for now */
  private now(): ISODate { return new Date().toISOString(); }

  /** Trim/collapse whitespace; return undefined if empty */
  private norm(s?: string): string | undefined {
    if (s == null) return undefined;
    const t = s.trim();
    return t.length ? t : undefined;
  }

  private parseLines(s?: string): string[] | undefined {
    if (!s) return undefined;
    const arr = s.split(/\r?\n/g).map(v => v.trim()).filter(Boolean);
    return arr.length ? arr : undefined;
  }

  private parseList(s?: string): string[] | undefined {
    if (!s) return undefined;
    const arr = s.split(/[\s,]+/g).map(v => v.trim()).filter(Boolean);
    return arr.length ? arr : undefined;
  }

  private mergeModel(src?: Partial<ReqSpecsItem>): ReqSpecsItem {
    const createdAt: ISODate = src?.createdAt ?? this.now();
    const updatedAt: ISODate = src?.updatedAt ?? createdAt;

    return {
      id: src?.id ?? '',
      projectId: this.projectId,
      type: (src?.type ?? 'functional'),
      title: this.norm(src?.title) ?? '',
      description: this.norm(src?.description) ?? '',
      acceptanceCriteria: src?.acceptanceCriteria,
      rationale: this.norm(src?.rationale),
      source: this.norm(src?.source),
      priority: (src?.priority ?? 'should'),
      status: (src?.status ?? 'draft'),
      parentId: this.parentId ?? src?.parentId, // set from outside; user does not edit
      order: src?.order,
      standards: src?.standards,
      links: src?.links,
      related: src?.related,
      createdBy: src?.createdBy ?? this.createdBy,
      createdAt,
      updatedAt,
      tags: src?.tags,
    } as ReqSpecsItem;
  }

  addStandard() { this.standards = [...this.standards, { code: '' }]; }
  removeStandard(i: number) { this.standards = this.standards.filter((_, idx) => idx !== i); }
  addLink() { this.links = [...this.links, { title: '', url: '' }]; }
  removeLink(i: number) { this.links = this.links.filter((_, idx) => idx !== i); }

  formValid(): boolean {
    return !!this.item.title && !!this.item.projectId && !!this.item.createdBy?.uid
      && !!this.item.type && !!this.item.priority && !!this.item.status;
  }

  resetToModel(): void {
    this.item = this.mergeModel(this.model);
    this.standards = [...(this.model?.standards ?? [])];
    this.links = [...(this.model?.links ?? [])];
    this.acceptanceCriteriaText = (this.model?.acceptanceCriteria ?? []).join('\n');
    this.relatedText = (this.model?.related ?? []).join(' ');
    this.tagsText = (this.model?.tags ?? []).join(' ');
  }

  submit(): void {
    // Normalize
    this.item.title = this.item.title.trim();
    this.item.description = this.item.description?.trim() ?? '';
    this.item.rationale = this.norm(this.item.rationale);
    this.item.source = this.norm(this.item.source);

    // Text → arrays
    const acceptanceCriteria = this.parseLines(this.acceptanceCriteriaText);
    const related = this.parseList(this.relatedText);
    const tags = this.parseList(this.tagsText);

    // Standards clean
    const standards = this.standards
      .map(s => ({ code: this.norm(s.code), clause: this.norm(s.clause), note: this.norm(s.note) }))
      .filter(s => !!s.code) as StandardRef[];

    // Links clean with required fields only
    const links = this.links
      .map(l => {
        const url = this.norm(l.url);
        if (!url) return null;
        const title = this.norm(l.title) ?? url;
        return { title, url };
      })
      .filter((x): x is { title: string; url: string } => !!x);

    const payload: ReqSpecsItem = {
      ...this.item,
      acceptanceCriteria,
      related,
      tags,
      standards: standards.length ? standards : undefined,
      links: links.length ? links : undefined,
      updatedAt: new Date().toISOString(),
    };

    // Strip empties
    if (!payload.parentId) delete (payload as any).parentId;
    if (!payload.order && payload.order !== 0) delete (payload as any).order;
    if (!payload.acceptanceCriteria?.length) delete (payload as any).acceptanceCriteria;
    if (!payload.related?.length) delete (payload as any).related;
    if (!payload.tags?.length) delete (payload as any).tags;
    if (!payload.standards?.length) delete (payload as any).standards;
    if (!payload.links?.length) delete (payload as any).links;

    this.saved.emit(payload);
  }
}
