import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, getDoc, setDoc, collection, getDocs } from '@angular/fire/firestore';
import { AUDIT_CHECKLIST } from '../core/utils/audit';
import { AuditChecklistItem } from "../core/general/general.types";
import { VocabularyService } from '../audit/audit-vocabulary.service';

@Component({
  selector: 'app-admin-audit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container py-5">
      <h2>Manage Audit Checklist Items</h2>

      <!-- Upload Button -->
      <button class="btn btn-outline-primary mb-3" [disabled]="uploading" (click)="uploadAuditChecklist()">
        {{ uploading ? 'Uploading...' : 'Upload Audit Checklist' }}
      </button>

      <!-- Progress bar -->
      @if (uploading) {
        <div class="progress mb-3">
          <div class="progress-bar" role="progressbar" [style.width.%]="progress">{{ progress }}%</div>
        </div>
      }

      <!-- Upload status -->
      @if (status) {
        <p>{{ status }}</p>
      }

      <div class="w-100"></div>

      <button class="btn btn-outline-primary mb-3" (click)="uploadVocabularySectors()">Upload sectors</button>

      <!-- Filter section -->
      <div class="mb-3">
        <label>Select Sector/Section/Subsection:</label>
        <select class="form-select mb-2" [(ngModel)]="filterSector">
          <option value="">All Sectors</option>
          <option *ngFor="let s of sectors">{{ s }}</option>
        </select>

        <select class="form-select mb-2" [(ngModel)]="filterSection">
          <option value="">All Sections</option>
          <option *ngFor="let s of sections">{{ s }}</option>
        </select>

        <select class="form-select mb-2" [(ngModel)]="filterSubsection">
          <option value="">All Subsections</option>
          <option *ngFor="let s of subsections">{{ s }}</option>
        </select>
      </div>

      <!-- Table of checklist items -->
      <table class="table table-bordered table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Sector</th>
            <th>Section</th>
            <th>Subsection</th>
            <th>Title</th>
            <th>Criticality</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (item of filteredItems(); track item.id) {
            <tr>
              <td>{{ item.id }}</td>
              <td>{{ item.sector }}</td>
              <td>{{ item.section }}</td>
              <td>{{ item.subsection }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.criticality }}</td>
              <td>
                <button class="btn btn-sm btn-outline-secondary" (click)="editItem(item)">Edit</button>
              </td>
            </tr>
          }
        </tbody>
      </table>

      <!-- Edit modal -->
      @if (editingItem) {
        <div class="modal d-block bg-dark bg-opacity-50">
            <div class="modal-dialog">
            <div class="modal-content p-3">
                <h5>Edit Audit Checklist Item</h5>

                <div class="mb-2">
                <label for="title" class="form-label">Title</label>
                <input id="title" class="form-control" [(ngModel)]="editingItem.title" placeholder="Title">
                </div>

                <div class="mb-2">
                <label for="description" class="form-label">Description</label>
                <textarea id="description" class="form-control" [(ngModel)]="editingItem.description" placeholder="Description"></textarea>
                </div>

                <div class="mb-3">
                <label for="criticality" class="form-label">Criticality</label>
                <select id="criticality" class="form-select" [(ngModel)]="editingItem.criticality">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                </div>

                <div class="d-flex justify-content-end">
                <button class="btn btn-outline-secondary me-2" (click)="editingItem = null">Cancel</button>
                <button class="btn btn-outline-success" (click)="saveEdit()">Save</button>
                </div>
            </div>
            </div>
        </div>
        }

    </div>
  `
})
export class AdminAuditComponent {

  status = '';
  uploading = false;
  progress = 0;

  filterSector = '';
  filterSection = '';
  filterSubsection = '';

  items: AuditChecklistItem[] = [];
  editingItem: AuditChecklistItem | null = null;

  constructor(private firestore: Firestore, private vocabulary: VocabularyService) {
    this.loadItems();
  }

  // Load existing items
  async loadItems() {
    const colRef = collection(this.firestore, 'vocabulary/auditChecklistItems/items');
    const snap = await getDocs(colRef);
    this.items = snap.docs.map(doc => doc.data() as AuditChecklistItem);
  }

  // Upload all checklist items
  async uploadAuditChecklist() {
    this.uploading = true;
    this.progress = 0;

    const total = AUDIT_CHECKLIST.length;
    let processed = 0;
    let updated = 0;
    let added = 0;

    for (const item of AUDIT_CHECKLIST) {
      const docRef = doc(this.firestore, 'vocabulary/auditChecklistItems/items', item.id);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        await setDoc(docRef, item);
        updated++;
      } else {
        await setDoc(docRef, item);
        added++;
      }

      processed++;
      this.progress = Math.round((processed / total) * 100);
    }

    this.status = `Upload complete. Added ${added} new items, updated ${updated} existing items.`;
    this.uploading = false;

    // Reload
    this.loadItems();
  }

  // Get unique sectors
  get sectors() {
    return Array.from(new Set(this.items.map(i => i.sector))).sort();
  }

  get sections() {
    return Array.from(new Set(this.items.map(i => i.section))).sort();
  }

  get subsections() {
    return Array.from(new Set(this.items.map(i => i.subsection))).sort();
  }

  // Filtered view
  filteredItems() {
    return this.items.filter(i =>
      (!this.filterSector || i.sector === this.filterSector) &&
      (!this.filterSection || i.section === this.filterSection) &&
      (!this.filterSubsection || i.subsection === this.filterSubsection)
    );
  }

  // Open edit modal
  editItem(item: AuditChecklistItem) {
    this.editingItem = { ...item };
  }

  // Save changes
  async saveEdit() {
    if (!this.editingItem) return;

    const docRef = doc(this.firestore, 'vocabulary/auditChecklistItems/items', this.editingItem.id);
    await setDoc(docRef, this.editingItem);

    this.status = `Item ${this.editingItem.id} updated`;
    this.editingItem = null;
    this.loadItems();
  }

  uploadVocabularySectors() {
    this.vocabulary.uploadVocabularySectors();
  }
}
