import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type StoredAuditReport = {
  id: string;
  projectId: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  status: 'draft' | 'submitted' | 'approved';
  findings: StoredReportFinding[];
  summary: {
    totalChecklistItems: number;
    totalFindings: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    unresolvedFindings: number;
    acceptedCount: number;
    needsWorkCount: number;
  };
};

type StoredReportFinding = {
  findingId: string;
  checklistItemId: string;
  reviewerComments?: string;
  correctionPlan?: string;
  statusAfterReview?: 'accepted' | 'needs_work' | 'rejected';
  resolvedBy?: string;
  resolvedAt?: string;
  snapshot?: {
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    detectedAt: string;
  };
};

@Component({
  selector: 'app-audit-report-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 border rounded bg-white">
      <h3 class="mb-4">Audit Report</h3>

      <div class="mb-3">
        <strong>Status:</strong> 
        <span class="badge bg-warning text-dark">{{ report.status }}</span>
        <span class="ms-3 text-muted">Created: {{ report.createdAt }}</span>
      </div>

      <div class="row text-center mb-4">
        <div class="col">
          <div class="fw-bold">{{ report.summary.totalChecklistItems }}</div>
          <small>Checklist Items</small>
        </div>
        <div class="col">
          <div class="fw-bold">{{ report.summary.totalFindings }}</div>
          <small>Findings</small>
        </div>
        <div class="col">
          <div class="fw-bold text-danger">{{ report.summary.criticalCount }}</div>
          <small>Critical</small>
        </div>
        <div class="col">
          <div class="fw-bold text-warning">{{ report.summary.highCount }}</div>
          <small>High</small>
        </div>
        <div class="col">
          <div class="fw-bold text-info">{{ report.summary.mediumCount }}</div>
          <small>Medium</small>
        </div>
        <div class="col">
          <div class="fw-bold text-secondary">{{ report.summary.lowCount }}</div>
          <small>Low</small>
        </div>
      </div>

      <h5 class="mt-4">Findings Review</h5>

      <div *ngFor="let f of report.findings; let i = index" class="border rounded p-3 mb-3">
        <h6 class="mb-1">
          {{ i + 1 }}. {{ f.snapshot?.title || 'Untitled Finding' }}
          <span class="badge ms-2"
            [ngClass]="{
              'bg-danger': f.snapshot?.severity === 'critical',
              'bg-warning text-dark': f.snapshot?.severity === 'high',
              'bg-info text-dark': f.snapshot?.severity === 'medium',
              'bg-secondary': f.snapshot?.severity === 'low'
            }">{{ f.snapshot?.severity }}</span>
        </h6>

        <p class="text-muted mb-2"><small>{{ f.snapshot?.description }}</small></p>

        <div class="mb-2">
          <label class="form-label fw-bold">Reviewer Comments</label>
          <textarea [(ngModel)]="f.reviewerComments" class="form-control" rows="2"></textarea>
        </div>

        <div class="mb-2">
          <label class="form-label fw-bold">Correction Plan</label>
          <textarea [(ngModel)]="f.correctionPlan" class="form-control" rows="2"></textarea>
        </div>

        <div class="mb-2">
          <label class="form-label fw-bold">Status After Review</label>
          <select [(ngModel)]="f.statusAfterReview" class="form-select">
            <option [ngValue]="undefined">-- Select --</option>
            <option value="accepted">Accepted</option>
            <option value="needs_work">Needs Work</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <button class="btn btn-success w-100 mt-3" (click)="save.emit(report)">
        <i class="bi bi-save"></i> Save Report
      </button>
    </div>
  `
})
export class AuditReportFormComponent {
  @Input() report!: StoredAuditReport;
  @Output() save = new EventEmitter<StoredAuditReport>();
}
