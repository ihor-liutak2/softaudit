import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { COMPANY_SEEDS } from '../core/utils/companies';
import { VocabularyService } from './audit-vocabulary.service';
import { Sector } from '../core/general/general.types';


@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-5">
      <h3>Add Audit Project</h3>

      <form (ngSubmit)="submit()" class="mt-4">

        <!-- Project Title -->
        <div class="mb-3">
          <label class="form-label">Project Title</label>
          <input type="text" class="form-control" [(ngModel)]="title" name="title" required>
          @if (!title) {
            <small class="text-danger">Project title is required</small>
          }
        </div>

        <!-- Project Description -->
        <div class="mb-3">
          <label class="form-label">Project Description</label>
          <textarea class="form-control" [(ngModel)]="description" name="description" rows="3"></textarea>
        </div>

        <!-- Company selection -->
        <div class="mb-3">
          <label class="form-label">Select Company</label>
          <select class="form-select" [(ngModel)]="companyId" name="companyId" required>
            <option value="">Select a company</option>
            <option *ngFor="let company of companies" [value]="company.id">{{ company.name }}</option>
          </select>
          @if (!companyId) {
            <small class="text-danger">Company selection is required</small>
          }
        </div>

        <!-- Sector selection -->
        <div class="mb-3">
          <label class="form-label">Select Sector</label>
          <select class="form-select" [(ngModel)]="sectorId" name="sectorId" required>
            <option value="">Select a sector</option>
            <option *ngFor="let sec of sectors" [value]="sec.id">{{ sec.name }}</option>
          </select>
          @if (!sectorId) {
            <small class="text-danger">Sector selection is required</small>
          }
        </div>

        <!-- Start Date -->
        <div class="mb-3">
          <label class="form-label">Start Date</label>
          <input type="date" class="form-control" [(ngModel)]="startDate" name="startDate" required>
          @if (!startDate) {
            <small class="text-danger">Start date is required</small>
          }
        </div>

        <!-- End Date -->
        <div class="mb-3">
          <label class="form-label">End Date (optional)</label>
          <input type="date" class="form-control" [(ngModel)]="endDate" name="endDate">
        </div>

        <!-- Audit Team -->
        <div class="mb-3">
          <label class="form-label">Audit Team (comma separated emails)</label>
          <input type="text" class="form-control" [(ngModel)]="auditTeamInput" name="auditTeam">
        </div>

        <!-- Submit Button -->
        <button class="btn btn-outline-success w-100" [disabled]="!formValid()">Add Project</button>

      </form>
    </div>
  `
})
export class AddProjectComponent implements OnInit {

  title = '';
  description = '';
  companyId = '';
  sectorId = '';
  startDate = '';
  endDate = '';
  auditTeamInput = '';

  companies = COMPANY_SEEDS;
  sectors: Sector[] = [];

  constructor(private vocabularyService: VocabularyService) {}

  ngOnInit() {
    this.vocabularyService.loadSectors();
    this.sectors = this.vocabularyService.sectors();

  }

  submit() {
    const auditTeam = this.auditTeamInput.split(',').map(email => email.trim()).filter(email => email);

    const project = {
      title: this.title,
      description: this.description,
      companyId: this.companyId,
      sectorId: this.sectorId,
      startDate: this.startDate,
      endDate: this.endDate || undefined,
      auditTeam,
      createdAt: new Date().toISOString(),
      status: 'planning',
      active: true
    };

    console.log('Created Project:', project);

    alert('Project added (console log only for now)');
    // TODO: Save to Firestore
  }

  formValid(): boolean {
    return Boolean(this.title.trim() && this.companyId && this.sectorId && this.startDate);
  }
}
