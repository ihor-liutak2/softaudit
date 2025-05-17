import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReqSpecsProject } from './req-specs.types';
import { Company, Sector } from '../core/general/general.types';

@Component({
  selector: 'app-req-specs-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <form (ngSubmit)="onSubmit()" class="p-4 border rounded bg-light">
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input class="form-control" [(ngModel)]="project.title" name="title" required>
      </div>

      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea class="form-control" [(ngModel)]="project.description" name="description" rows="3"></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Company</label>
        <select class="form-select" [(ngModel)]="project.companyId" name="companyId" required>
          <option value="">-- Select Company --</option>
          <option *ngFor="let company of companies" [value]="company.id">{{ company.name }}</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Sector</label>
        <select class="form-select" [(ngModel)]="project.sector" name="sector" required>
          <option value="">-- Select Sector --</option>
          <option *ngFor="let sector of sectors" [value]="sector.id">{{ sector.name }}</option>
        </select>
      </div>

      <div class="row g-2 mb-3">
        <div class="col-md-6">
          <label class="form-label">Start Date</label>
          <input type="date" class="form-control" [(ngModel)]="project.startDate" name="startDate" required>
        </div>
        <div class="col-md-6">
          <label class="form-label">End Date</label>
          <input type="date" class="form-control" [(ngModel)]="project.endDate" name="endDate">
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Status</label>
        <select class="form-select" [(ngModel)]="project.status" name="status">
          <option value="draft">Draft</option>
          <option value="in_progress">In Progress</option>
          <option value="approved">Approved</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <button class="btn btn-primary" type="submit">Save</button>
    </form>
  `
})
export class ReqSpecsProjectFormComponent {
  @Input() project!: ReqSpecsProject;
  @Input() companies: Company[] = [];
  @Input() sectors: Sector[] = [];

  @Output() save = new EventEmitter<ReqSpecsProject>();

  onSubmit() {
    if (this.project.title && this.project.companyId && this.project.sector && this.project.startDate) {
      this.save.emit(this.project);
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
