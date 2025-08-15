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
import { StandardsCatalogService } from './standards-catalog.service';

// --- Quality model (type + computation)
  type QualityCheck = {
    key: string;                // stable id
    label: string;              // short label for a badge
    ok: boolean;                // pass/fail
    severity: 'ok'|'warn'|'fail';
    tip?: string;               // suggestion if not ok
  };

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


    <!-- Live quality guidance (SMART + IEEE 830) -->
    <div class="mt-2">
      <div class="small text-muted mb-1">Quality checks (SMART & IEEE 830)</div>

      <!-- Badges summary -->
      <div>
        @for (q of computeQualityChecks(item, splitCriteria(acceptanceCriteriaText)); track q.key) {
          <span class="me-1" [ngClass]="badgeClass(q)">{{ q.label }}{{ q.ok ? ' ✓' : '' }}</span>
        }
      </div>

      <!-- Actionable tips -->
      <ul class="mt-2 small mb-0">
        @for (q of computeQualityChecks(item, splitCriteria(acceptanceCriteriaText)); track 'tip-'+q.key) {
          @if (!q.ok && q.tip) {
            <li>{{ q.tip }}</li>
          }
        }
      </ul>
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

    <!-- Order -->
    <div class="mb-3">
      <label class="form-label">Order (optional)</label>
      <input type="number" class="form-control" [(ngModel)]="item.order" name="order" />
    </div>

    <!-- Standards (manual list) -->
    <div class="mb-3">
      <div class="d-flex justify-content-between align-items-center">
        <label class="form-label mb-0">Standards</label>
        <button type="button" class="btn btn-sm btn-outline-primary" (click)="addStandard()">Add</button>
      </div>

      @if (standards.length === 0) {
        <div class="form-text">No standards added.</div>
      }

      @for (s of standards; track $index; let i = $index) {
        <div class="border rounded p-2 mt-2">
          <div class="row g-2">
            <div class="col-md-4">
              <input class="form-control"
                     [(ngModel)]="s.code"
                     [name]="'std_code_' + i"
                     placeholder="Code (e.g., ISO/IEC 29148:2018)" />
            </div>
            <div class="col-md-3">
              <input class="form-control"
                     [(ngModel)]="s.clause"
                     [name]="'std_clause_' + i"
                     placeholder="Clause (e.g., 5.2.3)" />
            </div>
            <div class="col-md-4">
              <input class="form-control"
                     [(ngModel)]="s.note"
                     [name]="'std_note_' + i"
                     placeholder="Note" />
            </div>
            <div class="col-md-1 d-grid">
              <button type="button" class="btn btn-outline-danger" (click)="removeStandard(i)">&times;</button>
            </div>
          </div>
        </div>
      }
    </div>

    <!-- Standards (catalog picker) – helper, not part of form -->
    <div class="ps-3 border-start border-2 small text-muted">
      <div class="mb-3">
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
                    (click)="addRefFromCatalog()">
              Add
            </button>
          </div>
        </div>
      </div>
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
              <input class="form-control" [(ngModel)]="l.title" [name]="'link_title_' + i" placeholder="Title" />
            </div>
            <div class="col-md-6">
              <input class="form-control" [(ngModel)]="l.url" [name]="'link_url_' + i" placeholder="URL" />
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

  // у ReqSpecsItemFormComponent
  selStdId?: string;
  selClauseId?: string;

  constructor(public catalog: StandardsCatalogService) {}

  async  ngOnInit() {
    this.item = this.mergeModel(this.model);
    this.standards = [...(this.model?.standards ?? [])];
    this.links = [...(this.model?.links ?? [])];
    this.acceptanceCriteriaText = (this.model?.acceptanceCriteria ?? []).join('\n');
    this.relatedText = (this.model?.related ?? []).join(' ');
    this.tagsText = (this.model?.tags ?? []).join(' ');

    // Load standards catalog once
    await this.catalog.load();
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

  /** Add selected (standard, clause) from catalog into standards list */
  addRefFromCatalog(): void {
    if (!this.selStdId || !this.selClauseId) return;

    const ref = this.catalog.toRef(this.selStdId, this.selClauseId);
    console.debug('[Catalog Add]', ref);
    if (!ref) return;

    // Prevent duplicates (same code + clause)
    const exists = this.standards.some(s => s.code === ref.code && s.clause === ref.clause);
    if (exists) {
      // Optional: update note from catalog if it was empty
      this.standards = this.standards.map(s =>
        s.code === ref.code && s.clause === ref.clause
          ? { ...s, note: s.note || ref.note }
          : s
      );
    } else {
      this.standards = [...this.standards, ref];
    }

    // Reset helper selectors
    this.selStdId = undefined;
    this.selClauseId = undefined;
  }


  // --- Parse AC textarea into string[] (one per line)
  splitCriteria(text?: string): string[] {
    return (text || '')
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  // --- Heuristics used by checks
  private hasNumberAndUnit(s?: string): boolean {
    if (!s) return false;
    const number = /\b\d+(\.\d+)?\b/;
    const unitOrComparator =
      /\b(%|ms|s|sec|seconds|min|minutes|h|hrs|rps|tps|req\/s|users|KB|MB|GB|GiB|MiB|bps|kbps|Mbps|Hz|kHz|°C|C|F)\b|<=|>=|<|>|within|under|no more than|at least/i;
    return number.test(s) && unitOrComparator.test(s);
  }

  private hasTimeBound(s?: string): boolean {
    if (!s) return false;
    return /\b(within\s+\d+\s*(ms|s|sec|minutes?|hours?)|by\s+\d{4}-\d{2}-\d{2}|until\s+\d{4}-\d{2}-\d{2})\b/i.test(s);
  }

  private looksLikeRequirement(s?: string): boolean {
    if (!s) return false;
    return /\b(shall|must|should|will)\b/i.test(s);
  }

  private hasAmbiguity(s?: string): boolean {
    if (!s) return false;
    const vague = /\b(fast|quick|user[- ]?friendly|easy|optimi[sz]e|as soon as possible|etc\.?|and\/or|robust|state[- ]of[- ]the[- ]art|adequate|appropriate|tbd|to be determined|approximately)\b/i;
    return vague.test(s);
  }

  // 's' can be undefined, but is not an optional parameter anymore
  private tooLong(s: string | undefined, max: number): boolean {
    return !!s && s.length > max;
  }


  private any<T>(arr?: T[]): boolean { return Array.isArray(arr) && arr.length > 0; }

  

  /** Build SMART & IEEE-830 checks from current form values. */
  computeQualityChecks(
    item: {
      title?: string;
      description?: string;
      acceptanceCriteria?: string[];
      priority?: string;
      rationale?: string;
      source?: string;
      tags?: string[];
      links?: Array<{ title?: string; url?: string }>;
      related?: string[];
    },
    criteria?: string[]
  ): QualityCheck[] {
    const ac = (item.acceptanceCriteria && item.acceptanceCriteria.length)
      ? item.acceptanceCriteria
      : (criteria || []);

    const title = (item.title || '').trim();
    const desc  = (item.description || '').trim();

    // SMART
    const specificOk   = this.looksLikeRequirement(title) || this.looksLikeRequirement(desc);
    const measurableOk = this.hasNumberAndUnit(title) || this.hasNumberAndUnit(desc) || ac.some(x => this.hasNumberAndUnit(x));
    const achievableOk = !/\b(100%\s*uptime|zero\s*latency|never\s*fail|always|impossible)\b/i.test(title + ' ' + desc);
    const relevantOk   = !!(item.rationale || item.source);
    const timeOk       = this.hasTimeBound(title) || this.hasTimeBound(desc) || ac.some(x => this.hasTimeBound(x));

    // IEEE 830 (automatable subset)
    const unambiguousOk = !(this.hasAmbiguity(title) || this.hasAmbiguity(desc) || ac.some(x => this.hasAmbiguity(x)));
    const completeOk    = !!title && (desc.length > 0 || ac.length > 0);
    const verifiableOk  = ac.length > 0;
    const rankedOk      = !!(item.priority && item.priority.trim());
    const traceableOk   = !!((item.source && item.source.trim()) || this.any(item.links) || this.any(item.related));
    const modifiableOk  = !this.tooLong(title, 160) && !this.tooLong(desc, 2000);

    const checks: QualityCheck[] = [
      { key: 'smart-specific',   label: 'Specific',    ok: specificOk,   severity: specificOk ? 'ok' : 'fail',
        tip: specificOk ? undefined : 'Use an action verb (e.g., “The system shall …”).' },
      { key: 'smart-measurable', label: 'Measurable',  ok: measurableOk, severity: measurableOk ? 'ok' : 'warn',
        tip: measurableOk ? undefined : 'Add numbers/units or comparators (≤, ≥, within N ms, % users, etc.).' },
      { key: 'smart-achievable', label: 'Achievable',  ok: achievableOk, severity: achievableOk ? 'ok' : 'warn',
        tip: achievableOk ? undefined : 'Avoid absolute claims like “zero latency”, “100% uptime”.' },
      { key: 'smart-relevant',   label: 'Relevant',    ok: relevantOk,   severity: relevantOk ? 'ok' : 'warn',
        tip: relevantOk ? undefined : 'Provide rationale or source to justify relevance.' },
      { key: 'smart-time',       label: 'Time-bound',  ok: timeOk,       severity: timeOk ? 'ok' : 'warn',
        tip: timeOk ? undefined : 'Add a timeframe (“within 200 ms”, “by 2025-03-01”).' },

      { key: 'ieee-unambiguous', label: 'Unambiguous', ok: unambiguousOk, severity: unambiguousOk ? 'ok' : 'warn',
        tip: unambiguousOk ? undefined : 'Avoid vague words: fast, user-friendly, etc., and/or, approx.' },
      { key: 'ieee-complete',    label: 'Complete',    ok: completeOk,    severity: completeOk ? 'ok' : 'warn',
        tip: completeOk ? undefined : 'Add short description or at least one acceptance criterion.' },
      { key: 'ieee-verifiable',  label: 'Verifiable',  ok: verifiableOk,  severity: verifiableOk ? 'ok' : 'fail',
        tip: verifiableOk ? undefined : 'Add acceptance criteria that a tester can check.' },
      { key: 'ieee-ranked',      label: 'Ranked',      ok: rankedOk,      severity: rankedOk ? 'ok' : 'warn',
        tip: rankedOk ? undefined : 'Set priority (Must/Should/Could/Won’t or High/Med/Low).' },
      { key: 'ieee-traceable',   label: 'Traceable',   ok: traceableOk,   severity: traceableOk ? 'ok' : 'warn',
        tip: traceableOk ? undefined : 'Add source, link, or related IDs for traceability.' },
      { key: 'ieee-modifiable',  label: 'Modifiable',  ok: modifiableOk,  severity: modifiableOk ? 'ok' : 'warn',
        tip: modifiableOk ? undefined : 'Keep title concise (<160 chars) and description reasonably short.' },
    ];

    return checks;
  }

  // --- Badge class helper
  badgeClass(q: QualityCheck): string {
    if (q.severity === 'ok')   return 'badge text-bg-success';
    if (q.severity === 'fail') return 'badge text-bg-danger';
    return 'badge text-bg-warning';
  }

  
}
