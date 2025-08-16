// src/app/requirements_specs/req-specs-item-edit.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

import { ReqSpecsItem, UserRef } from './req-specs.types';
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
      <h4 class="mb-2">{{ isEdit ? 'Edit Requirement' : 'New Requirement' }}</h4>

      @if (!isEdit && parentIdFromQuery) {
        <div class="mb-3 small text-muted">
          Child of: <span class="badge bg-light text-dark">
            {{ parentLabel || parentIdFromQuery }}
          </span>
        </div>
      }

      @if (ready) {
        <app-req-specs-item-form
          [projectId]="projectId"
          [createdBy]="currentUserRef || { uid: 'unknown' }"
          [parentId]="!isEdit ? parentIdFromQuery : undefined"
          [parentLabel]="!isEdit ? parentLabel : undefined"
          [model]="existingItem"
          (saved)="save($event)">
        </app-req-specs-item-form>
      } @else {
        <div class="alert alert-info">Loading requirement...</div>
      }
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

  // Sub-item state (from query param ?parent=...)
  parentIdFromQuery?: string;
  parentLabel?: string;

  // UI state
  ready = false;
  existingItem?: Partial<ReqSpecsItem>;
  currentUserRef?: UserRef;

  async ngOnInit() {
    // Resolve route params
    this.projectId = this.route.snapshot.paramMap.get('projectId') ?? '';
    this.itemId = this.route.snapshot.paramMap.get('itemId');
    this.isEdit = !!this.itemId;

    // Resolve sub-item parent from query param if creating new
    if (!this.isEdit) {
      this.parentIdFromQuery = this.route.snapshot.queryParamMap.get('parent') ?? undefined;
      if (this.parentIdFromQuery) {
        // Load parent to show a friendly label (title)
        const parentRef = doc(this.firestore, `${COLL_REQSPECS}/${this.parentIdFromQuery}`);
        const parentSnap = await getDoc(parentRef);
        const parent = parentSnap.exists() ? (parentSnap.data() as ReqSpecsItem) : undefined;
        this.parentLabel = parent?.title;
      }
    }

    // Build UserRef from current user (no undefined fields)
    const u = this.userService.user;
    this.currentUserRef = u ? this.toUserRef(u) : undefined;

    // Load existing item if edit mode
    if (this.isEdit && this.itemId) {
      const ref = doc(this.firestore, `${COLL_REQSPECS}/${this.itemId}`);
      const snap = await getDoc(ref);
      if (snap.exists()) this.existingItem = snap.data() as ReqSpecsItem;
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

  /** Generate a safe id (uses existing, crypto.randomUUID, or a fallback) */
  private safeId(existing?: string): string {
    const e = (existing || '').trim();
    if (e) return e;
    // browser-safe fallback if crypto.randomUUID is unavailable
    const hasCryptoUUID = typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function';
    return hasCryptoUUID
      ? (crypto as any).randomUUID()
      : `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  /** Save (create or update) the requirement - full overwrite */
  async save(item: ReqSpecsItem) {
    try {
      // Resolve id deterministically
      const id = this.itemId ?? this.safeId(item.id);

      // Prefer parentId from query when creating; respect explicit value on edit
      const parentId = this.isEdit
        ? (item.parentId?.trim() || undefined)
        : (this.parentIdFromQuery ?? (item.parentId?.trim() || undefined));

      // Normalize arrays
      const acceptanceCriteria = (item.acceptanceCriteria ?? [])
        .map(s => (s ?? '').trim())
        .filter(Boolean);

      const standards = (item.standards ?? [])
        .map(s => ({
          code: (s.code ?? '').trim(),
          clause: (s.clause ?? '').trim() || undefined,
          note: (s.note ?? '').trim() || undefined,
        }))
        .filter(s => !!s.code);

      type Link = { title: string; url: string };
      const links = (item.links ?? [])
        .map(l => {
          const url = (l?.url ?? '').trim();
          const title = (l?.title ?? '').trim();
          if (!url) return null;
          return { title: title || url, url } as Link;
        })
        .filter((v): v is Link => v !== null);

      const related = (item.related ?? []).map(x => `${x}`.trim()).filter(Boolean);
      const tags = (item.tags ?? []).map(t => t.trim()).filter(Boolean);

      // Keep original createdAt/createdBy on edit (we overwrite the doc)
      const createdAt = this.existingItem?.createdAt || item.createdAt || new Date().toISOString();
      const createdBy =
        this.existingItem?.createdBy ||
        item.createdBy ||
        this.currentUserRef || { uid: 'unknown' };

      const payload: ReqSpecsItem = {
        ...item,
        id,
        projectId: this.projectId,                 // enforce route project
        parentId,                                  // may be undefined
        acceptanceCriteria: acceptanceCriteria.length ? acceptanceCriteria : undefined,
        standards: standards.length ? standards : undefined,
        links: links.length ? links : undefined,
        related: related.length ? related : undefined,
        tags: tags.length ? tags : undefined,
        rationale: item.rationale?.trim() || undefined,
        source: item.source?.trim() || undefined,
        order: item.order ?? undefined,
        createdAt,
        createdBy,
        updatedAt: new Date().toISOString(),
      };

      // Remove all undefined fields before writing
      const clean = omitUndefinedDeep(payload);

      // Write (full overwrite)
      const ref = doc(this.firestore, `${COLL_REQSPECS}/${id}`);
      await setDoc(ref, clean, { merge: false });

      // Optional: console for diagnostics
      console.log('[ReqSpecsItemEdit] Saved', clean);

      // Navigate back to project
      this.router.navigate(['/req-specs/view', this.projectId]);
    } catch (err: any) {
      console.error('[ReqSpecsItemEdit] Save failed', err);
      alert(`Failed to save requirement: ${err?.message || err}`);
    }
  }

}
