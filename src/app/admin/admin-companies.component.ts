import { Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  Firestore,
  collection,
  collectionData,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  CollectionReference,
  DocumentData,
} from '@angular/fire/firestore';

import { COMPANY_SEEDS } from '../core/utils/companies';
import { Company } from '../core/general/general.types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-companies',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
  <div class="container py-5">
    <h2>Manage Companies</h2>

    <button class="btn btn-outline-primary mb-3" (click)="uploadCompanies()">Upload Companies</button>
    <p *ngIf="status">{{ status }}</p>

    <table class="table table-bordered table-striped" *ngIf="companies.length > 0">
      <thead>
        <tr>
          <th>Name</th>
          <th>Sector</th>
          <th>Address</th>
          <th>Active</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let company of companies">
          <td>{{ company.name }}</td>
          <td>{{ company.sector }}</td>
          <td>{{ company.address }}</td>
          <td>{{ company.active ? 'Yes' : 'No' }}</td>
          <td>
            <button class="btn btn-outline-secondary btn-sm me-2" (click)="toggleActive(company)">
              {{ company.active ? 'Deactivate' : 'Activate' }}
            </button>
            <button class="btn btn-outline-info btn-sm" (click)="edit(company)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Edit modal -->
    <div *ngIf="editing" class="modal fade show d-block" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Company</h5>
            <button type="button" class="btn-close" (click)="editing = undefined"></button>
          </div>
          <div class="modal-body">
            <input class="form-control mb-2" [(ngModel)]="editing!.name" placeholder="Name">
            <input class="form-control mb-2" [(ngModel)]="editing!.description" placeholder="Description">
            <input class="form-control mb-2" [(ngModel)]="editing!.address" placeholder="Address">
            <input class="form-control mb-2" type="number" [(ngModel)]="editing!.employeesCount" placeholder="Employees Count">
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" (click)="editing = undefined">Cancel</button>
            <button class="btn btn-outline-primary" (click)="saveEdit()">Save</button>
          </div>
        </div>
      </div>
    </div>

  </div>
  `
})
export class AdminCompaniesComponent {

  private readonly firestore = inject(Firestore);
  private readonly destroyRef = inject(DestroyRef);

  status = '';
  companies: Company[] = [];
  editing?: Company;

  constructor() {
    this.loadCompanies();
  }

  async loadCompanies() {
    const ref: CollectionReference<DocumentData> = collection(this.firestore, 'companies');
    collectionData(ref, { idField: 'id' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => this.companies = data as Company[],
        error: (err) => this.status = `Load error: ${err?.message || err}`
      });
  }

  async uploadCompanies() {
    let added = 0, skipped = 0;

    for (const company of COMPANY_SEEDS) {
      // ensure company.id exists in your seeds; otherwise generate one:
      // const id = company.id || doc(collection(this.firestore, 'companies')).id;
      const docRef = doc(this.firestore, 'companies', company.id);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        skipped++;
        continue;
      }

      await setDoc(docRef, company);
      added++;
    }

    this.status = `Added ${added} companies. Skipped ${skipped} existing companies.`;
  }

  async toggleActive(company: Company) {
    const docRef = doc(this.firestore, 'companies', company.id);
    await updateDoc(docRef, { active: !company.active });
  }

  edit(company: Company) {
    // clone to avoid direct edit before save
    this.editing = { ...company };
  }

  async saveEdit() {
    if (!this.editing) return;

    const docRef = doc(this.firestore, 'companies', this.editing.id);
    await updateDoc(docRef, {
      name: this.editing.name,
      description: this.editing.description,
      address: this.editing.address,
      employeesCount: this.editing.employeesCount
    });

    this.editing = undefined;
  }
}
