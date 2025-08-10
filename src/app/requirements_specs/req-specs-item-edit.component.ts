import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

import { ReqSpecsItem, UserRef, ISODate } from './req-specs.types';
import { ReqSpecsItemFormComponent } from './req-specs-item-form.component';
import { UserService } from '../core/user/user.service';
import { COLL_REQSPECS } from './req-specs.collections';
import { omitUndefinedDeep } from './req-specs-utils.function';

@Component({
  selector: 'app-req-specs-item-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReqSpecsItemFormComponent],
  template: `
    <div class="container py-4">
      <h4 class="mb-4">{{ isEdit ? 'Edit Requirement' : 'New Requirement' }}</h4>

      <ng-container *ngIf="ready; else loading">
        <app-req-specs-item-form
          [projectId]="projectId"
          [createdBy]="currentUserRef || { uid: 'unknown' }"
          [model]="existingItem"
          (saved)="save($event)">
        </app-req-specs-item-form>
      </ng-container>

      <ng-template #loading>
        <div class="alert alert-info">Loading requirement...</div>
      </ng-template>
    </div>
  `
})
export class ReqSpecsItemEditComponent implements OnInit {
  // Services
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly firestore = inject(Firestore);
  public readonly userService = inject(UserService);

  // Route state
  projectId = '';
  itemId: string | null = null;
  isEdit = false;

  // UI state
  ready = false;
  existingItem?: Partial<ReqSpecsItem>;
  currentUserRef?: UserRef;

  async ngOnInit() {
    // Resolve route params
    this.projectId = this.route.snapshot.paramMap.get('projectId') ?? '';
    this.itemId = this.route.snapshot.paramMap.get('itemId');
    this.isEdit = !!this.itemId;

    // Build UserRef from current user (no undefined fields)
    const u = this.userService.user;
    this.currentUserRef = u ? this.toUserRef(u) : undefined;

    // Load existing item if edit mode
    if (this.isEdit && this.itemId) {
      const ref = doc(this.firestore, `${COLL_REQSPECS}/${this.itemId}`);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        this.existingItem = snap.data() as ReqSpecsItem;
      }
    }

    this.ready = true;
  }

  /** Map your AppUser to a clean UserRef (no undefined fields) */
  private toUserRef(u: any): UserRef {
    return {
      uid: u.uid,
      ...(u.displayName ? { name: u.displayName } : {}),
      ...(u.email ? { email: u.email } : {}),
    };
  }

  /** Save (create or update) the requirement */
  async save(item: ReqSpecsItem) {
    const id = this.itemId ?? crypto.randomUUID();
    const ref = doc(this.firestore, `${COLL_REQSPECS}/${id}`);

    // Build acceptance criteria safely (empty -> undefined)
    const ac = (item.acceptanceCriteria ?? [])
      .map(s => (s ?? '').trim())
      .filter(Boolean);
    const acceptanceCriteria = ac.length ? ac : undefined;

    // Build standards safely (empty -> undefined)
    const stds = (item.standards ?? [])
      .map(s => ({
        code: (s.code ?? '').trim(),
        clause: (s.clause ?? '').trim() || undefined,
        note: (s.note ?? '').trim() || undefined,
      }))
      .filter(s => !!s.code);
    const standards = stds.length ? stds : undefined;

    // Build links safely (title must be string, url required)
    type Link = { title: string; url: string };
    const lnks = (item.links ?? [])
      .map(l => {
        const url = (l?.url ?? '').trim();
        const title = (l?.title ?? '').trim(); // <- always string
        if (!url) return null;
        return { title, url } as Link;
      })
      .filter((v): v is Link => v !== null);
    const links: Link[] | undefined = lnks.length ? lnks : undefined;

    // Related and tags (empty -> undefined)
    const related = (item.related ?? []).filter(Boolean);
    const tags = (item.tags ?? []).map(t => t.trim()).filter(Boolean);

    // Now payload matches the type exactly
    const payload: ReqSpecsItem = {
      ...item,
      id,
      projectId: this.projectId,
      acceptanceCriteria,
      standards,
      links,                                  // <- type-safe now
      related: related.length ? related : undefined,
      tags: tags.length ? tags : undefined,
      parentId: item.parentId?.trim() || undefined,
      order: item.order ?? undefined,
      rationale: item.rationale?.trim() || undefined,
      source: item.source?.trim() || undefined,
      updatedAt: new Date().toISOString(),
      createdAt: item.createdAt || new Date().toISOString(),
      createdBy: item.createdBy || {
        uid: this.userService.user?.uid ?? 'unknown',
        name: this.userService.user?.displayName ?? undefined,
        email: this.userService.user?.email ?? undefined,
      },
    };

    // 🔑 Firestore-safe: remove every `undefined`
    const clean = omitUndefinedDeep(payload);

    await setDoc(ref, clean, { merge: true });
    this.router.navigate(['/req-specs/project', this.projectId]);
  }
}
