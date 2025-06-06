import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditProject, Company } from '../core/general/general.types';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-audit-project-table',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="p-3 border rounded bg-light mb-4">
      <div class="row g-2">
        <div class="col">
          <input type="text" class="form-control" placeholder="Search user (email)" [ngModel]="searchUser()" (ngModelChange)="searchUser.set($event)">
        </div>
        <div class="col">
          <select class="form-select" [ngModel]="filterCompany()" (ngModelChange)="filterCompany.set($event)">
            <option value="">All companies</option>
            @for (company of companies; track company.id) {
              <option [value]="company.id">{{ company.name }}</option>
            }
          </select>
        </div>
        <div class="col">
          <input type="date" class="form-control" [ngModel]="filterStartFrom()" (ngModelChange)="filterStartFrom.set($event)">
        </div>
        <div class="col">
          <input type="date" class="form-control" [ngModel]="filterStartTo()" (ngModelChange)="filterStartTo.set($event)">
        </div>
        <div class="col">
          <select class="form-select" [ngModel]="filterStatus()" (ngModelChange)="filterStatus.set($event)">
            <option value="">All statuses</option>
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
    </div>

    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Project</th>
          <th>Company</th>
          <th>Sector</th>
          <th>Start</th>
          <th>End</th>
          <th>Status</th>
          <th>Active</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        @for (project of filteredProjects(); track project.id) {
          <tr>
            <td>{{ project.title }}</td>
            <td>{{ companyName(project.companyId) }}</td>
            <td>{{ project.sector }}</td>
            <td>{{ project.startDate }}</td>
            <td>{{ project.endDate || '-' }}</td>
            <td>{{ project.status }}</td>
            <td>
              @if (project.active) {
                <span class="badge bg-success">Active</span>
              } @else {
                <span class="badge bg-secondary">Inactive</span>
              }
            </td>
            <td>
              <button class="btn btn-outline-primary btn-sm me-2" (click)="editProject.emit(project)">Edit</button>
              <button class="btn btn-outline-secondary btn-sm me-2" (click)="manageFindings.emit(project)">Manage Findings</button>
              <a [routerLink]="['/audit/report', project.id]" class="btn btn-outline-dark btn-sm">
                <i class="bi bi-file-earmark-text"></i> Report
              </a>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `
})
export class AuditProjectTableComponent {

  @Input() projects: AuditProject[] = [];
  @Input() companies: Company[] = [];

  @Output() editProject = new EventEmitter<AuditProject>();
  @Output() manageFindings = new EventEmitter<AuditProject>();

  searchUser = signal('');
  filterCompany = signal('');
  filterStartFrom = signal('');
  filterStartTo = signal('');
  filterStatus = signal('');

  filteredProjects = computed(() => {
    return this.projects.filter(project => {

      if (this.searchUser() && !project.auditTeam.some(email => email.toLowerCase().includes(this.searchUser().toLowerCase()))) {
        return false;
      }

      if (this.filterCompany() && project.companyId !== this.filterCompany()) {
        return false;
      }

      if (this.filterStartFrom() && project.startDate < this.filterStartFrom()) {
        return false;
      }

      if (this.filterStartTo() && project.startDate > this.filterStartTo()) {
        return false;
      }

      if (this.filterStatus() && project.status !== this.filterStatus()) {
        return false;
      }

      return true;
    });
  });

  companyName(companyId: string) {
    const company = this.companies.find(c => c.id === companyId);
    return company?.name || companyId;
  }
}
