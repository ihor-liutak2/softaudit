import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

import { ReqSpecsItem, UserRef, ISODate } from './req-specs.types';
import { ReqSpecsItemFormComponent } from './req-specs-item-form.component';
import { UserService } from '../core/user/user.service';
import { COLL_REQSPECS } from './req-specs.collections';

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
    // Generate/gather IDs and timestamps
    const id = this.itemId ?? crypto.randomUUID();
    const now: ISODate = new Date().toISOString();

    // Ensure required refs are present
    const createdBy: UserRef =
      item.createdBy ||
      this.currentUserRef ||
      { uid: 'unknown' };

    const createdAt: ISODate = item.createdAt || now;

    // Compose payload
    const payload: ReqSpecsItem = {
      ...item,
      id,
      projectId: this.projectId,
      createdBy,
      createdAt,
      updatedAt: now,
    };

    // Prune empty optional fields to keep documents tidy
    const prune = (v: any) => (Array.isArray(v) ? (v.length ? v : undefined) : v);
    (payload as any).parentId = payload.parentId || undefined;
    (payload as any).order = (payload.order || payload.order === 0) ? payload.order : undefined;
    payload.acceptanceCriteria = prune(payload.acceptanceCriteria);
    payload.related = prune(payload.related);
    payload.tags = prune(payload.tags);
    payload.standards = prune(payload.standards);
    payload.links = prune(payload.links);
    payload.rationale = payload.rationale || undefined;
    payload.source = payload.source || undefined;

    // Persist
    const ref = doc(this.firestore, `${COLL_REQSPECS}/${id}`);
    await setDoc(ref, payload, { merge: true });

    // Navigate back to project view
    this.router.navigate(['/req-specs/project', this.projectId]);
  }
}
