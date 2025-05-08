import { Component, Input, Output, EventEmitter, signal, computed, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sector, Company, AuditProject } from '../core/general/general.types';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="submit()" class="mt-4 row g-3">

    <!-- Project Title -->
    <div class="col-12 col-md-6">
      <label class="form-label">Project Title</label>
      <input type="text" class="form-control" [(ngModel)]="title" name="title" required #titleInput="ngModel">
      @if (titleInput.touched && !title) {
        <small class="text-danger">Project title is required</small>
      }
    </div>

    <!-- Description -->
    <div class="col-12 col-md-6">
      <label class="form-label">Project Description</label>
      <textarea class="form-control" [(ngModel)]="description" name="description" rows="3"></textarea>
    </div>

    <!-- Company + Search -->
    <div class="col-12 col-md-6">
      <label class="form-label">Select Company</label>
      <input type="text" class="form-control mb-2" placeholder="Search company..." [value]="companySearch()" (input)="onCompanySearch($event)">
      <select class="form-select" [(ngModel)]="companyId" name="companyId" required #companySelect="ngModel">
        <option value="">Select a company</option>
        <option *ngFor="let company of filteredCompanies()" [value]="company.id">{{ company.name }}</option>
      </select>
      @if (companySelect.touched && !companyId) {
        <small class="text-danger">Company selection is required</small>
      }
    </div>

    <!-- Sector -->
    <div class="col-12 col-md-6">
      <label class="form-label">Select Sector</label>
      <select class="form-select" [(ngModel)]="sectorId" name="sectorId" required #sectorSelect="ngModel">
        <option value="">Select a sector</option>
        <option *ngFor="let sec of sectors" [value]="sec.id">{{ sec.name }}</option>
      </select>
      @if (sectorSelect.touched && !sectorId) {
        <small class="text-danger">Sector selection is required</small>
      }
    </div>

    <!-- Start Date -->
    <div class="col-12 col-md-6">
      <label class="form-label">Start Date</label>
      <input type="date" class="form-control" [(ngModel)]="startDate" name="startDate" required #startDateInput="ngModel">
      @if (startDateInput.touched && !startDate) {
        <small class="text-danger">Start date is required</small>
      }
    </div>

    <!-- End Date -->
    <div class="col-12 col-md-6">
      <label class="form-label">End Date (optional)</label>
      <input type="date" class="form-control" [(ngModel)]="endDate" name="endDate">
    </div>

    <!-- Status selection -->
    <div class="col-12 col-md-6">
      <label class="form-label">Status</label>
      <select class="form-select" [(ngModel)]="status" name="status" required #statusSelect="ngModel">
        <option value="">Select status</option>
        <option value="planned">Planned</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
        <option value="archived">Archived</option>
      </select>
      @if (statusSelect.touched && !status) {
        <small class="text-danger">Status is required</small>
      }
    </div>

    <!-- Audit Team -->
    <div class="col-12">
      <label class="form-label">Audit Team (comma separated emails)</label>
      <input type="text" class="form-control" [(ngModel)]="auditTeamInput" name="auditTeam">
    </div>

    <!-- Submit -->
    <div class="col-12">
      <button class="btn btn-outline-success w-100" [disabled]="!formValid()">Save Project</button>
    </div>

  </form>
  `
})
export class ProjectFormComponent implements OnChanges {

  @Input() companies: Company[] = [];
  @Input() sectors: Sector[] = [];
  @Input() project?: AuditProject;
  @Input() authorEmail = '';


  @Output() save = new EventEmitter<any>();

  title = '';
  description = '';
  companyId = '';
  sectorId = '';
  startDate = '';
  endDate = '';
  auditTeamInput = '';
  status = '';
  companySearch = signal('');

  filteredCompanies = computed(() => {
    const search = this.companySearch().toLowerCase();
    return this.companies.filter(company =>
      (company.name ?? '').toLowerCase().includes(search)
    );
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project'] && this.project) {
      this.title = this.project.title || '';
      this.description = this.project.description || '';
      this.companyId = this.project.companyId || '';
      this.sectorId = this.project.sector || '';  // Note: sector -> sectorId
      this.startDate = this.project.startDate || '';
      this.endDate = this.project.endDate || '';
      this.auditTeamInput = (this.project.auditTeam || []).join(', ');
    }
  }

  formValid(): boolean {
    return Boolean(this.title.trim() && this.companyId && this.sectorId && this.startDate);
  }

  submit() {
    if (!this.formValid()) return;
  
    const auditTeam = this.auditTeamInput
      .split(',')
      .map(email => email.trim())
      .filter(email => email);
  
    // Add author email (from input) if not already in auditTeam
    if (this.authorEmail && !auditTeam.includes(this.authorEmail)) {
      auditTeam.unshift(this.authorEmail);
    }
  
    this.save.emit({
      id: this.project?.id || undefined,
      companyId: this.companyId,
      title: this.title,
      description: this.description || undefined,
      sector: this.sectorId,
      startDate: this.startDate,
      endDate: this.endDate || undefined,
      status: this.status as 'planned' | 'active' | 'completed' | 'archived',
      active: this.project?.active ?? true,
      auditTeam,
      checklistItems: this.project?.checklistItems || [],
      findings: this.project?.findings || [],
      createdAt: this.project?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as AuditProject);
  }
  
  onCompanySearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.companySearch.set(input.value);
  }
}
