import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, doc, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { AuditReportFormComponent } from './audit-report-form.component';
import { AuditFinding, AuditProject, StoredAuditReport } from '../core/general/general.types';
import { FormsModule } from '@angular/forms';
import { buildEmptyAuditReport } from './audit-build-empty-audit-report.function';
import { AuditReportService } from './audit-report.service';

@Component({
  selector: 'app-audit-project-report',
  standalone: true,
  imports: [CommonModule, FormsModule, AuditReportFormComponent],
  template: `
    <div class="container py-4">
      <h3 class="mb-3">Audit Project Report</h3>

      <div *ngIf="project" class="mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>Project:</strong> {{ project.title }}<br>
            <strong>Status:</strong> {{ project.status }}
          </div>

          <button class="btn btn-outline-secondary btn-sm" (click)="toggleCompanyRoles()">
            <i class="bi bi-people"></i> Assign Roles
          </button>
        </div>

        <div *ngIf="showRoles()" class="mt-3 border rounded p-3 bg-light">
          <h6>Company Representatives</h6>
          <div *ngFor="let rep of project.companyRepresentatives ?? []; let i = index" class="row g-2 mb-2">
            <div class="col-md-4">
              <input [(ngModel)]="rep.name" placeholder="Name" class="form-control">
            </div>
            <div class="col-md-4">
              <input [(ngModel)]="rep.email" placeholder="Email" class="form-control">
            </div>
            <div class="col-md-4">
              <select [(ngModel)]="rep.role" class="form-select">
                <option value="quality_manager">Quality Manager</option>
                <option value="system_owner">System Owner</option>
                <option value="compliance_officer">Compliance Officer</option>
                <option value="external_observer">External Observer</option>
              </select>
            </div>
          </div>
          <button class="btn btn-sm btn-outline-primary" (click)="addRepresentative()">
            <i class="bi bi-plus"></i> Add Representative
          </button>
        </div>
      </div>

      <div *ngIf="report; else loading">
        <app-audit-report-form [report]="report" (save)="saveReport($event)"></app-audit-report-form>
      </div>

      <ng-template #loading>
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-3">Loading audit report...</p>
        </div>
      </ng-template>
    </div>
  `
})
export class AuditProjectReportComponent implements OnInit {
  projectId = '';
  report!: StoredAuditReport;
  project!: AuditProject;
  showRoles = signal(false);

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private auditReportService: AuditReportService
  ) {}

  toggleCompanyRoles() {
    this.showRoles.set(!this.showRoles());
  }

  addRepresentative() {
    if (!this.project.companyRepresentatives) {
      this.project.companyRepresentatives = [];
    }
    this.project.companyRepresentatives.push({ name: '', role: 'quality_manager' });
  }

  async ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    const projectSnap = await getDoc(doc(this.firestore, 'auditProjects', this.projectId));
    if (!projectSnap.exists()) return;
    this.project = projectSnap.data() as AuditProject;

    const report = await this.auditReportService.getReportById(this.projectId);

    if (report) {
      this.report = report;
    } else {
      const findingsSnap = await getDocs(query(
        collection(this.firestore, 'auditFindings'),
        where('projectId', '==', this.projectId)
      ));
      const findings = findingsSnap.docs.map(d => d.data() as AuditFinding);

      this.report = buildEmptyAuditReport(this.project, findings, 'unknown@system');
      await this.auditReportService.createReport(this.report);
    }
  }

  async saveReport(updated: StoredAuditReport) {
    const cleaned = this.removeUndefined(updated);
    const reportRef = doc(this.firestore, 'auditReports', updated.id);
    await setDoc(reportRef, cleaned, { merge: true });
    alert('Report saved');
  }
  
  

  private removeUndefined(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(o => this.removeUndefined(o));
    } else if (typeof obj === 'object' && obj !== null) {
      const cleaned: any = {};
      for (const key in obj) {
        if (obj[key] !== undefined) {
          cleaned[key] = this.removeUndefined(obj[key]);
        }
      }
      return cleaned;
    }
    return obj;
  }
  
}
