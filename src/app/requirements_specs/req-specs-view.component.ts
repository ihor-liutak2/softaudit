import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Firestore, collection, query, where, orderBy, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReqSpecsItem, Id } from './req-specs.types';
import { COLL_REQSPECS } from './req-specs.collections';

type Row = {
  item: ReqSpecsItem;
  level: number;
  parentTitle?: string;
};

@Component({
  selector: 'app-reqspecs-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [`
    .indent { display: block; }
    .parent-badge {
      display: inline-block;
      margin-top: .25rem;
      font-size: .75rem;
    }
  `],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="mb-0">Requirement Items</h3>
        <a class="btn btn-outline-success"
           [routerLink]="['/req-specs/project', projectId, 'item']">
          <i class="bi bi-plus-lg me-1"></i> Add Requirement
        </a>
      </div>

      <table class="table table-bordered table-hover">
        <thead class="table-light">
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Updated</th>
            <th style="width: 260px;">Actions</th>
          </tr>
        </thead>

        <tbody>
          @for (row of flatRows(); track row.item.id) {
            <tr>
              <td>
                <div class="indent" [style.marginLeft.px]="row.level * 20">
                  <a [routerLink]="['/req-specs/project', projectId, 'item', row.item.id]">
                    {{ row.item.title || '(no title)' }}
                  </a>
                  @if (row.parentTitle) {
                    <span class="badge bg-light text-dark border parent-badge">
                      child of: {{ row.parentTitle }}
                    </span>
                  }
                </div>
              </td>

              <td>{{ row.item.type }}</td>
              <td><span class="badge bg-info">{{ row.item.priority }}</span></td>
              <td><span class="badge bg-secondary">{{ row.item.status }}</span></td>
              <td>{{ row.item.updatedAt | date:'short' }}</td>

              <td class="d-flex gap-2">
                <a class="btn btn-sm btn-outline-primary"
                   [routerLink]="['/req-specs/project', projectId, 'item', row.item.id]">
                  <i class="bi bi-pencil"></i> Edit
                </a>

                <a class="btn btn-sm btn-outline-success"
                   [routerLink]="['/req-specs/project', projectId, 'item']"
                   [queryParams]="{ parent: row.item.id }">
                  <i class="bi bi-node-plus"></i> Add child
                </a>

                <button class="btn btn-sm btn-outline-danger" (click)="remove(row.item.id)">
                  <i class="bi bi-trash"></i> Delete
                </button>
              </td>
            </tr>
          }
          @empty {
            <tr>
              <td colspan="6" class="text-center text-muted py-3">No requirements found for this project.</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class ReqSpecsViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private firestore = inject(Firestore);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  projectId: Id = '';
  items = signal<ReqSpecsItem[]>([]);

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id') ?? '';

    const ref = collection(this.firestore, COLL_REQSPECS);
    const qy = query(ref, where('projectId', '==', this.projectId), orderBy('updatedAt', 'desc'));

    collectionData(qy, { idField: 'id' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          const list = (data as ReqSpecsItem[]).filter(i => !!i.id);
          this.items.set(this.sortForTree(list));
        },
        error: err => {
          console.error('[ReqSpecsView] load error', err);
          this.items.set([]);
        }
      });
  }

  /** Stable sort: group by parent, then by 'order', then by title */
  private sortForTree(list: ReqSpecsItem[]): ReqSpecsItem[] {
    return [...list].sort((a, b) => {
      const ap = a.parentId ?? '';
      const bp = b.parentId ?? '';
      if (ap !== bp) return ap.localeCompare(bp);
      const ao = a.order ?? 0;
      const bo = b.order ?? 0;
      if (ao !== bo) return ao - bo;
      return (a.title || '').localeCompare(b.title || '');
    });
  }

  /** Build DFS rows: parent first, then all descendants */
  flatRows = computed<Row[]>(() => {
    const all = this.items();
    const map = new Map<string, ReqSpecsItem>();
    all.forEach(i => map.set(i.id, i));

    // adjacency
    const children = new Map<string, ReqSpecsItem[]>();
    all.forEach(i => {
      const pid = i.parentId ?? '__root__';
      if (!children.has(pid)) children.set(pid, []);
      children.get(pid)!.push(i);
    });

    // sort children arrays
    for (const arr of children.values()) {
      arr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)
        || (a.title || '').localeCompare(b.title || ''));
    }

    const out: Row[] = [];
    const visit = (it: ReqSpecsItem, level: number) => {
      out.push({
        item: it,
        level,
        parentTitle: it.parentId ? (map.get(it.parentId)?.title || it.parentId) : undefined
      });
      const kids = children.get(it.id) ?? [];
      kids.forEach(k => visit(k, level + 1));
    };

    // roots first
    (children.get('__root__') ?? []).forEach(r => visit(r, 0));
    return out;
  });

  async remove(id: string) {
    if (!confirm('Delete this requirement? Children (if any) are NOT deleted.')) return;
    await deleteDoc(doc(this.firestore, `${COLL_REQSPECS}/${id}`));
  }
}
