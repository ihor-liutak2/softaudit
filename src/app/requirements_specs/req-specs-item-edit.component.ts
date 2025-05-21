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
        [model]="existingItem"
        (saved)="save($event)">
      </app-req-specs-item-form>
    </div>
  `
})
export class ReqSpecsItemEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private firestore = inject(Firestore);
  public userService = inject(UserService);

  projectId = '';
  itemId: string | null = null;
  isEdit = false;
  existingItem?: Partial<ReqSpecsItem>;

  async ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('projectId') ?? '';
    this.itemId = this.route.snapshot.paramMap.get('itemId');
    this.isEdit = !!this.itemId;

    if (this.isEdit && this.itemId) {
      const snap = await getDoc(doc(this.firestore, 'reqspecs', this.itemId));
      if (snap.exists()) {
        this.existingItem = snap.data() as ReqSpecsItem;
      }
    }
  }

  async save(item: ReqSpecsItem) {
    const docRef = doc(this.firestore, 'reqspecs', item.id || crypto.randomUUID());
    const payload = { ...item, id: docRef.id };

    // Remove undefined fields like parentId if not set
    if (!payload.parentId) {
      delete payload.parentId;
    }

    if (this.isEdit) {
      await updateDoc(docRef, payload);
    } else {
      await setDoc(docRef, payload);
    }

    alert('Requirement saved');
    this.router.navigate(['/req-specs/project', this.projectId]);
  }
}
