import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { ReqSpecsItem } from './req-specs.types';
import { ReqSpecsItemFormComponent } from './req-specs-item-form.component';
import { FormsModule } from '@angular/forms';
import { UserService } from '../core/user/user.service';

@Component({
  selector: 'app-req-specs-item-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReqSpecsItemFormComponent],
  template: `
    <div class="container py-4">
      <h4 class="mb-4">{{ isEdit ? 'Edit Requirement' : 'New Requirement' }}</h4>

      <app-req-specs-item-form
        [projectId]="projectId"
        [createdBy]="userService.userEmail"
        [model]="existingItem || undefined"
        (saved)="save($event)">
      </app-req-specs-item-form>
    </div>
  `
})
export class ReqSpecsItemEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly firestore = inject(Firestore);
  public readonly userService = inject(UserService);

  projectId = '';
  itemId: string | null = null;
  isEdit = false;
  existingItem: ReqSpecsItem | null = null;

  async ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('projectId') ?? '';
    this.itemId = this.route.snapshot.paramMap.get('itemId');
    this.isEdit = !!this.itemId;

    if (this.isEdit && this.itemId) {
      const ref = doc(this.firestore, 'reqspecs', this.itemId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        this.existingItem = snap.data() as ReqSpecsItem;
      } else {
        // If the item was not found, fall back to create mode
        console.warn(`ReqSpecs item ${this.itemId} not found, switching to create mode`);
        this.isEdit = false;
        this.existingItem = null;
      }
    }
  }

  async save(item: ReqSpecsItem) {
    // ensure projectId preserved from route
    const id = item.id || crypto.randomUUID();
    const docRef = doc(this.firestore, 'reqspecs', id);

    const payload: ReqSpecsItem = {
      ...item,
      id,
      projectId: this.projectId || item.projectId, // prefer route projectId
    };

    // drop undefined optional fields (e.g., parentId)
    if (!payload.parentId) delete (payload as any).parentId;

    if (this.isEdit) {
      // updateDoc fails if doc doesn't exist — додали fallback
      const exists = (await getDoc(docRef)).exists();
      if (exists) {
        await updateDoc(docRef, payload as any);
      } else {
        await setDoc(docRef, payload);
      }
    } else {
      await setDoc(docRef, payload);
    }

    this.router.navigate(['/req-specs/project', this.projectId]);
  }
}
