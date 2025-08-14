import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
  CollectionReference,
  DocumentData,
} from '@angular/fire/firestore';

import { ReqSpecsService } from './req-specs.service';
import {
  ReqSpecsProject,
  ReqSpecsItem,
  Priority,
  StandardRef,
  UserRef,
  Id,
} from './req-specs.types';
import { COLL_REQSPECS } from './req-specs.collections';
import { StandardsCatalogService } from './standards-catalog.service';


@Component({
  selector: 'app-req-specs-srs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      @if (project(); as p) {

        <div class="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h2 class="mb-1">{{ p.name }}</h2>
            <div class="text-muted small">
              Company: {{ companyName(p.companyId) }} |
              Sector: {{ sectorName(p.sectorId) }} |
              Status: {{ p.status }}
            </div>
            <div class="text-muted small">
              Created: {{ p.createdAt | date:'short' }}
              • Deadline: {{ p.deadlineAt ? (p.deadlineAt | date:'shortDate') : '—' }}
            </div>
          </div>
          <button class="btn btn-sm btn-outline-dark" (click)="exportMarkdown()">
            <i class="bi bi-download"></i> Export draft (Markdown)
          </button>
        </div>

        <!-- Overview -->
        <div class="card mb-3">
          <div class="card-header fw-semibold">Overview</div>
          <div class="card-body">
            <p class="mb-2">
              <strong>Description.</strong> {{ p.description || 'No description provided.' }}
            </p>
            <p class="mb-2">
              <strong>Scope.</strong> {{ p.scope || '—' }}
            </p>
            <p class="mb-0">
              <strong>Domain context.</strong> {{ p.domainContext || '—' }}
            </p>
          </div>
        </div>

        <!-- Stakeholders -->
        <div class="card mb-3">
          <div class="card-header fw-semibold">Stakeholders</div>
          <div class="card-body">
            @if (p.stakeholders?.length) {
              <ul class="mb-0">
                @for (s of p.stakeholders; track s.name) {
                  <li>
                    {{ s.name }}@if (s.role) { <span> — {{ s.role }}</span> }
                    @if (s.contact) { <span class="text-muted"> ({{ s.contact }})</span> }
                  </li>
                }
              </ul>
            } @else {
              <span class="text-muted">—</span>
            }
          </div>
        </div>

        <!-- SRS guidance from standards (mapsTo → sections) -->
        <div class="card mb-3">
          <div class="card-header fw-semibold">Coverage (SRS sections from standards)</div>
          <div class="card-body">
            @if (sectionCoverage().length) {
              <!-- Covered -->
              <div class="mb-2">
                <span class="me-2 fw-semibold">Covered:</span>
                @for (s of sectionCoverage(); track s.key) {
                  @if (s.status === 'covered') {
                    <span class="badge text-bg-success me-1">{{ s.label }}</span>
                  }
                }
              </div>

              <!-- Pending (expected by project standards, but no matching items yet) -->
              <div class="mb-2">
                <span class="me-2 fw-semibold">Pending:</span>
                @for (s of sectionCoverage(); track s.key) {
                  @if (s.status === 'pending') {
                    <span class="badge text-bg-warning me-1">{{ s.label }}</span>
                  }
                }
              </div>

              <!-- Incidental (implemented by items but not declared in project standards) -->
              <div class="mb-0">
                <span class="me-2 fw-semibold">Incidental:</span>
                @for (s of sectionCoverage(); track s.key) {
                  @if (s.status === 'incidental') {
                    <span class="badge text-bg-secondary me-1">{{ s.label }}</span>
                  }
                }
              </div>
            } @else {
              <span class="text-muted">—</span>
            }
          </div>
        </div>


        <!-- Standards (project-level) -->
        <div class="card mb-3">
          <div class="card-header fw-semibold">Standards</div>
          <div class="card-body">
            @if (p.standards?.length) {
              <ul class="mb-0">
                @for (s of p.standards; track s.code + ':' + (s.clause || '')) {
                  <li>{{ standardLabel(s) }}</li>
                }
              </ul>
            } @else {
              <span class="text-muted">—</span>
            }
          </div>
        </div>

        <!-- Coverage (project-level) -->
        <div class="card mb-3">
          <div class="card-header fw-semibold">
            Coverage
          </div>
          <div class="card-body">
            @if ((project()?.standards?.length ?? 0) === 0) {
              <span class="text-muted">No project standards selected.</span>
            } @else {
              <div class="mb-2 small">
                Totals:
                <span class="badge me-1" [class]="coverageBadgeClass('covered')">
                  Covered {{ coverage().totals.covered }}
                </span>
                <span class="badge me-1" [class]="coverageBadgeClass('partial')">
                  Partial {{ coverage().totals.partial }}
                </span>
                <span class="badge" [class]="coverageBadgeClass('missing')">
                  Missing {{ coverage().totals.missing }}
                </span>
              </div>

              <div class="table-responsive">
                <table class="table table-sm align-middle mb-0">
                  <thead class="table-light">
                    <tr>
                      <th style="width:40%">Clause</th>
                      <th style="width:12%">Status</th>
                      <th>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (r of coverage().rows; track r.projectRef) {
                      <tr>
                        <td>{{ displayRef(r.projectRef) }}</td>
                        <td>
                          <span class="badge" [class]="coverageBadgeClass(r.status)">{{ r.status }}</span>
                        </td>
                        <td class="small">
                          @if (r.exactItems.length) {
                            <strong>Exact:</strong> {{ listTitles(r.exactItems) }}
                          }
                          @if (!r.exactItems.length && r.looseItems.length) {
                            <strong>Partial:</strong> {{ listTitles(r.looseItems) }}
                          }
                          @if (!r.exactItems.length && !r.looseItems.length) {
                            <span class="text-muted">—</span>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>


        <!-- Functional requirements (hierarchical) -->
        <div class="card mb-3">
          <div class="card-header fw-semibold">Functional Requirements</div>
          <div class="card-body">
            @if (functionalTree().length) {
              <ol class="mb-0 list-unstyled">
                @for (row of functionalTree(); track row.item.id) {
                  <li class="mb-2">
                    <div [ngStyle]="indentStyle(row.level)">
                      <div class="fw-semibold">{{ row.item.title }}</div>
                      @if (row.item.description) {
                        <div class="small text-muted">{{ row.item.description }}</div>
                      }
                      <div class="small mt-1">
                        <span class="badge bg-info me-1">{{ row.item.priority }}</span>
                        <span class="badge bg-secondary">{{ row.item.status }}</span>
                        @if (row.item.standards?.length) {
                          <span class="ms-2">
                            <em>Standards:</em> {{ standardsSummary(row.item.standards) }}
                          </span>
                        }
                      </div>
                      <!-- Quality rules guidance (from mapsTo: qualityRule) -->
                      <div class="small mt-1">
                        @for (qb of qualityBadges(row.item); track qb.rule) {
                          <span class="badge me-1"
                                [ngClass]="qb.ok ? 'text-bg-success' : 'text-bg-warning'">
                            {{ qb.label }}{{ qb.ok ? ' ✓' : ' ?' }}
                          </span>
                        }
                      </div>

                      @if (row.item.acceptanceCriteria?.length) {
                        <div class="small mt-1">
                          <em>Acceptance criteria:</em>
                          <ul class="mb-0">
                            @for (ac of row.item.acceptanceCriteria; track ac) {
                              <li>{{ ac }}</li>
                            }
                          </ul>
                        </div>
                      }
                    </div>
                  </li>
                }
              </ol>
            } @else {
              <span class="text-muted">No functional requirements.</span>
            }
          </div>
        </div>

        <!-- Non-functional requirements (hierarchical) -->
        <div class="card mb-3">
          <div class="card-header fw-semibold">Non-functional Requirements</div>
          <div class="card-body">
            @if (nonFunctionalTree().length) {
              <ol class="mb-0 list-unstyled">
                @for (row of nonFunctionalTree(); track row.item.id) {
                  <li class="mb-2">
                    <div [ngStyle]="indentStyle(row.level)">
                      <div class="fw-semibold">{{ row.item.title }}</div>
                      @if (row.item.description) {
                        <div class="small text-muted">{{ row.item.description }}</div>
                      }
                      <div class="small mt-1">
                        <span class="badge bg-info me-1">{{ row.item.priority }}</span>
                        <span class="badge bg-secondary">{{ row.item.status }}</span>
                        @if (row.item.standards?.length) {
                          <span class="ms-2">
                            <em>Standards:</em> {{ standardsSummary(row.item.standards) }}
                          </span>
                        }
                      </div>
                      <!-- Quality rules guidance (from mapsTo: qualityRule) -->
                      <div class="small mt-1">
                        @for (qb of qualityBadges(row.item); track qb.rule) {
                          <span class="badge me-1"
                                [ngClass]="qb.ok ? 'text-bg-success' : 'text-bg-warning'">
                            {{ qb.label }}{{ qb.ok ? ' ✓' : ' ?' }}
                          </span>
                        }
                      </div>

                      @if (row.item.acceptanceCriteria?.length) {
                        <div class="small mt-1">
                          <em>Acceptance criteria:</em>
                          <ul class="mb-0">
                            @for (ac of row.item.acceptanceCriteria; track ac) {
                              <li>{{ ac }}</li>
                            }
                          </ul>
                        </div>
                      }
                    </div>
                  </li>
                }
              </ol>
            } @else {
              <span class="text-muted">No non-functional requirements.</span>
            }
          </div>
        </div>

        <!-- Classification (MoSCoW) -->
        <div class="card">
          <div class="card-header fw-semibold">Classification (MoSCoW)</div>
          <div class="card-body">
            <div class="row g-3">
              @for (pKey of priorities; track pKey) {
                <div class="col-md-3">
                  <h6 class="mb-2">{{ pKey | titlecase }}</h6>
                  <ul class="mb-0 small">
                    @for (r of byPriority(pKey); track r.id) {
                      <li>{{ r.title }}</li>
                    }
                    @if (!byPriority(pKey).length) {
                      <li class="text-muted">—</li>
                    }
                  </ul>
                </div>
              }
            </div>
          </div>
        </div>

      } @else {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-3">Loading SRS…</p>
        </div>
      }
    </div>
  `
})
export class ReqSpecsSrsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private firestore = inject(Firestore);
  private reqSpecs = inject(ReqSpecsService);
  private catalog = inject(StandardsCatalogService);


  project = signal<ReqSpecsProject | undefined>(undefined);
  items = signal<ReqSpecsItem[]>([]);

  // MoSCoW order
  priorities: Priority[] = ['must', 'should', 'could', 'wont'];

  // Build a children index: parentId -> children[]
  private childrenIndex = computed(() => {
    const idx = new Map<Id, ReqSpecsItem[]>();
    for (const r of this.items()) {
      if (!r.parentId) continue;
      const arr = idx.get(r.parentId) ?? [];
      arr.push(r);
      idx.set(r.parentId, arr);
    }
    // stable sort children by order, then title
    for (const [k, arr] of idx.entries()) {
      arr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title));
      idx.set(k, arr);
    }
    return idx;
  });

  // Flattened trees for UI (by type)
  functionalTree = computed(() => this.flattenByType('functional'));
  nonFunctionalTree = computed(() => this.flattenByType('nonfunctional'));

  // For the MoSCoW section (flat)
  byPriority = (p: Priority) =>
    this.items()
      .filter(r => r.priority === p)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title));

  // Simple helpers for labels
  userLabel(u?: UserRef): string {
    if (!u) return '—';
    return u.name ?? u.email ?? u.uid ?? '—';
  }

  companyName = (id?: string) => {
    if (!id) return '—';
    return this.reqSpecs.companies().find(c => c.id === id)?.name ?? id;
  };

  sectorName = (id?: string) => {
    if (!id) return '—';
    return this.reqSpecs.sectors().find(s => s.id === id)?.name ?? id;
  };

  standardsSummary(list?: StandardRef[]): string {
    if (!list?.length) return '—';
    return list
      .map(s => [s.code, s.clause].filter(Boolean).join(' '))
      .join('; ');
  }

  indentStyle(level: number) {
    // Slight left padding for children
    return { marginLeft: `${level * 20}px` };
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    if (!id) return;

    // load lookups
    await this.reqSpecs.loadCompanies();

    // project by id
    const p = await this.reqSpecs.getProjectById(id);
    this.project.set(p);

    // all items for project (no orderBy to avoid composite index)
    const col = collection(this.firestore, COLL_REQSPECS) as CollectionReference<DocumentData>;
    const snap = await getDocs(query(col, where('projectId', '==', id)));
    const list = snap.docs.map(d => d.data() as ReqSpecsItem);

    // stable sort roots by order/title
    list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title));
    this.items.set(list);

    await this.catalog.load?.();
  }

  /** Flatten requirements tree by type to rows of { item, level } */
  private flattenByType(type: ReqSpecsItem['type']) {
    const roots = this.items().filter(r => r.type === type && !r.parentId);
    // already sorted in ngOnInit; just defensive sort
    roots.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title));

    const rows: Array<{ item: ReqSpecsItem; level: number }> = [];
    const pushWithChildren = (node: ReqSpecsItem, level: number) => {
      rows.push({ item: node, level });
      const kids = this.childrenIndex().get(node.id) ?? [];
      for (const ch of kids) pushWithChildren(ch, level + 1);
    };
    for (const r of roots) pushWithChildren(r, 0);
    return rows;
  }

  /** Export current SRS as Markdown, preserving hierarchy */
  exportMarkdown(): void {
    const p = this.project();
    const all = this.items();
    if (!p) return;

    const md: string[] = [];

    md.push(`# SRS: ${p.name}`);
    md.push('');
    md.push(`**Company:** ${this.companyName(p.companyId)}  `);
    md.push(`**Sector:** ${this.sectorName(p.sectorId)}  `);
    md.push(`**Status:** ${p.status}  `);
    md.push(`**Created:** ${p.createdAt}  `);
    md.push(`**Deadline:** ${p.deadlineAt ?? '—'}  `);
    md.push('');

    md.push(`## Overview`);
    md.push(p.description ? p.description : '_No description provided._');
    md.push('');
    md.push(`**Scope**`);
    md.push(p.scope ?? '—');
    md.push('');
    md.push(`**Domain context**`);
    md.push(p.domainContext ?? '—');
    md.push('');

    // New: Standards section in export
    md.push(`## Standards`);
    if (p.standards?.length) {
      p.standards.forEach(s => md.push(`- ${this.standardLabel(s)}`));
    } else {
      md.push('—');
    }
    md.push('');

    md.push(`## Stakeholders`);
    if (p.stakeholders?.length) {
      p.stakeholders.forEach(s => {
        const role = s.role ? ` — ${s.role}` : '';
        const contact = s.contact ? ` (${s.contact})` : '';
        md.push(`- ${s.name}${role}${contact}`);
      });
    } else {
      md.push('—');
    }
    md.push('');


    // Sections with hierarchy
    md.push(`## Functional Requirements`);
    this.writeTreeToMarkdown(this.flattenByType('functional'), md);

    // --- Coverage summary (project-level) ---
    const cov = this.coverage();
    md.push('## Coverage');
    if (cov.rows.length === 0) {
      md.push('—');
    } else {
      md.push(
        `**Totals:** Covered ${cov.totals.covered} • Partial ${cov.totals.partial} • Missing ${cov.totals.missing}`
      );
      md.push('');
      cov.rows.forEach(r => {
        const head = `- ${this.displayRef(r.projectRef)} — **${r.status.toUpperCase()}**`;
        md.push(head);
        if (r.exactItems.length) {
          md.push(`  - Exact: ${r.exactItems.map(x => x.title).join(', ')}`);
        }
        if (!r.exactItems.length && r.looseItems.length) {
          md.push(`  - Partial (same code, other clause): ${r.looseItems.map(x => x.title).join(', ')}`);
        }
      });
    }
    md.push('');


    md.push('');
    md.push(`## Non-functional Requirements`);
    this.writeTreeToMarkdown(this.flattenByType('nonfunctional'), md);

    md.push('');
    md.push(`## Classification (MoSCoW)`);
    this.priorities.forEach(pr => {
      const list = all
        .filter(r => r.priority === pr)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title));
      md.push(`### ${pr.toUpperCase()}`);
      if (list.length) {
        list.forEach(r => md.push(`- ${r.title}`));
      } else {
        md.push('—');
      }
      md.push('');
    });

    const blob = new Blob([md.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SRS_${(p.name || 'project').replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private writeTreeToMarkdown(
    rows: Array<{ item: ReqSpecsItem; level: number }>,
    out: string[]
  ) {
    if (!rows.length) {
      out.push('—');
      return;
    }
    rows.forEach(({ item, level }) => {
      const pad = '  '.repeat(level);
      out.push(`${pad}- **${item.title}**`);
      if (item.description) out.push(`${pad}  ${item.description}`);
      out.push(`${pad}  _Priority:_ ${item.priority}; _Status:_ ${item.status}`);
      if (item.standards?.length) {
        out.push(`${pad}  _Standards:_ ${this.standardsSummary(item.standards)}`);
      }
      if (item.acceptanceCriteria?.length) {
        out.push(`${pad}  _Acceptance criteria:_`);
        item.acceptanceCriteria.forEach((ac, i) => out.push(`${pad}    ${i + 1}. ${ac}`));
      }
    });
  }

  /** Pretty single-line label for a project-level StandardRef */
  standardLabel(s?: StandardRef): string {
    if (!s) return '';
    const code = (s.code || '').trim();
    const clause = (s.clause || '').trim();
    const note = (s.note || '').trim();
    // Format: "ISO/IEC 25010 §PE.TimeBehavior — Time behavior"
    return `${code}${clause ? ` §${clause}` : ''}${note ? ` — ${note}` : ''}`;
  }

  /** Normalize a StandardRef for comparison (trim + lowercase) */
  private normRef(s?: StandardRef) {
    const t = (v?: string) => (v ?? '').trim().toLowerCase();
    return s ? { code: t(s.code), clause: t(s.clause) } : { code: '', clause: '' };
  }

  /** Nice display text like "ISO/IEC 25010 §PE.TimeBehavior" */
  displayRef(r: StandardRef): string {
    const code = (r.code ?? '').trim();
    const clause = (r.clause ?? '').trim();
    return clause ? `${code} §${clause}` : code || '—';
  }

  /** Coverage status mapped to Bootstrap badge class */
  coverageBadgeClass(status: 'covered' | 'partial' | 'missing'): string {
    switch (status) {
      case 'covered': return 'text-bg-success';
      case 'partial': return 'text-bg-warning';
      default: return 'text-bg-secondary';
    }
  }

  /** Compute coverage for each project-level StandardRef against all items */
  coverage = computed(() => {
    const proj = this.project();
    const all = this.items();
    const list = proj?.standards ?? [];

    type Row = {
      projectRef: StandardRef;
      status: 'covered' | 'partial' | 'missing';
      exactItems: Array<{ id: string; title: string }>;
      looseItems: Array<{ id: string; title: string; clause?: string }>;
    };

    const rows: Row[] = list.map(projectRef => {
      const p = this.normRef(projectRef);

      const exactSet = new Map<string, { id: string; title: string }>();
      const looseSet = new Map<string, { id: string; title: string; clause?: string }>();

      // Walk through every item and its standards
      for (const it of all) {
        for (const r of (it.standards ?? [])) {
          const n = this.normRef(r);
          if (!n.code || n.code !== p.code) continue;

          // Exact = code + same clause (or project clause is empty and item has any clause/no clause)
          const exact =
            (!!p.clause && n.clause === p.clause) ||
            (!p.clause && (!!n.clause || !n.clause)); // project has no clause → any clause of same code is exact

          if (exact) {
            exactSet.set(it.id, { id: it.id, title: it.title });
          } else {
            // Same code, different clause → loose
            looseSet.set(it.id, { id: it.id, title: it.title, clause: r.clause });
          }
        }
      }

      const exactItems = [...exactSet.values()];
      const looseItems = [...looseSet.values()];
      const status: Row['status'] =
        exactItems.length > 0 ? 'covered' : (looseItems.length > 0 ? 'partial' : 'missing');

      return { projectRef, status, exactItems, looseItems };
    });

    const totals = rows.reduce(
      (acc, r) => {
        acc[r.status] += 1;
        return acc;
      },
      { covered: 0, partial: 0, missing: 0 } as Record<'covered'|'partial'|'missing', number>
    );

    return { rows, totals };
  });

  /** Render a comma-separated list of item titles */
  listTitles(list?: Array<{ title: string }>): string {
    return (list ?? []).map(x => (x?.title ?? '').trim()).filter(Boolean).join(', ');
  }

  /** Human-readable labels for SRS sections coming from mapsTo */
private SECTION_LABELS: Record<string, string> = {
  'functionalRequirements': 'Functional requirements',
  'nonFunctionalRequirements': 'Non-functional requirements',
  'nonFunctionalRequirements.performance': 'Performance',
  'nonFunctionalRequirements.security': 'Security',
  'nonFunctionalRequirements.reliability': 'Reliability',
  'nonFunctionalRequirements.usability': 'Usability',
  'nonFunctionalRequirements.maintainability': 'Maintainability',
  'nonFunctionalRequirements.portability': 'Portability',
  'constraints': 'Constraints',
};

private sectionLabel(key: string): string {
  if (this.SECTION_LABELS[key]) return this.SECTION_LABELS[key];
  // Fallback: last segment → Title Case
  const last = key.split('.').pop() || key;
  return last.charAt(0).toUpperCase() + last.slice(1);
}

/** Sections expected by selected project standards */
sectionsExpected = computed(() => {
  const p = this.project();
  return this.catalog.mapsToSectionsFor(p?.standards ?? []);
});

/** Sections actually covered by any item standards (union of all items) */
sectionsImplemented = computed(() => {
  const set = new Set<string>();
  for (const it of this.items()) {
    const secs = this.catalog.mapsToSectionsFor(it.standards ?? []);
    secs.forEach(s => set.add(s));
  }
  return Array.from(set);
});

/** Coverage status per section: covered | pending | incidental */
sectionCoverage = computed(() => {
  const exp = new Set(this.sectionsExpected());
  const imp = new Set(this.sectionsImplemented());
  const all = new Set<string>([...exp, ...imp]);

  const rows = Array.from(all).map(key => {
    const status = exp.has(key) && imp.has(key)
      ? 'covered'
      : exp.has(key) && !imp.has(key)
        ? 'pending'
        : 'incidental';
    return { key, label: this.sectionLabel(key), status };
  });

  // stable sort by status group then label
  const rank: Record<string, number> = { covered: 0, pending: 1, incidental: 2 };
  rows.sort((a, b) => (rank[a.status] - rank[b.status]) || a.label.localeCompare(b.label));
  return rows;
});

/** Expected quality rules for item: from its own standards + project standards */
private expectedRulesFor(item: ReqSpecsItem): string[] {
  const combined: StandardRef[] = [
    ...(item.standards ?? []),
    ...(this.project()?.standards ?? []),
  ];
  // dedupe
  const set = new Set(this.catalog.mapsToQualityRulesFor(combined));
  return Array.from(set);
}

/** Heuristic checks */
private hasQuantitativeText(text?: string): boolean {
  if (!text) return false;
  // numbers + units or constraint phrases
  const unit = /\b(%|ms|s|sec|seconds|min|minutes|h|hrs|rps|tps|req\/s|users|KB|MB|GB|GiB|MiB|bps|kbps|Mbps|Hz|kHz|°C|C|F)\b/i;
  const number = /\b\d+(\.\d+)?\b/;
  const comp = /\b(within|under|less than|no more than|at most|at least|>=|<=|<|>)\b/i;
  return (number.test(text) && unit.test(text)) || comp.test(text);
}

private isMeasurable(item: ReqSpecsItem): boolean {
  return this.hasQuantitativeText(item.title)
      || this.hasQuantitativeText(item.description)
      || (item.acceptanceCriteria ?? []).some(ac => this.hasQuantitativeText(ac));
}

private isVerifiable(item: ReqSpecsItem): boolean {
  // simple: presence of acceptance criteria means verifiable
  return !!(item.acceptanceCriteria && item.acceptanceCriteria.length);
}

private isTraceable(item: ReqSpecsItem): boolean {
  return !!((item.links && item.links.length) || (item.related && item.related.length) || item.source);
}

/** Build badges model for template */
qualityBadges(item: ReqSpecsItem): Array<{ rule: string; label: string; ok: boolean }> {
  const expected = this.expectedRulesFor(item);
  if (!expected.length) return [];

  const toBadge = (rule: string) => {
    const r = rule.toLowerCase();
    if (r === 'measurable') return { rule: 'measurable', label: 'Measurable', ok: this.isMeasurable(item) };
    if (r === 'verifiable') return { rule: 'verifiable', label: 'Verifiable', ok: this.isVerifiable(item) };
    if (r === 'traceable')  return { rule: 'traceable',  label: 'Traceable',  ok: this.isTraceable(item) };
    // default: unknown rule → neutral
    return { rule, label: rule.charAt(0).toUpperCase() + rule.slice(1), ok: true };
  };

  // dedupe & keep stable order
  const seen = new Set<string>();
  const out: Array<{ rule: string; label: string; ok: boolean }> = [];
  for (const r of expected) {
    const key = r.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(toBadge(key));
  }
  return out;
}

}
