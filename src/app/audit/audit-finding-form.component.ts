import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditFinding } from '../core/general/general.types';

@Component({
  selector: 'app-audit-finding-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 border rounded">

      <h5 class="fw-bold mb-3">{{ finding?.id ? 'Edit Finding' : 'Add Finding' }}</h5>

      <form (ngSubmit)="submit()" class="row g-3">

        <div class="col-12">
          <label class="form-label">Title</label>
          <input type="text" class="form-control" [(ngModel)]="title" name="title" required>
        </div>

        <div class="col-12">
          <label class="form-label">Description</label>
          <textarea class="form-control" [(ngModel)]="description" name="description" rows="3"></textarea>
        </div>

        <div class="col-md-6">
          <label class="form-label">Severity</label>
          <select class="form-select" [(ngModel)]="severity" name="severity" required>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div class="col-md-6">
          <label class="form-label">Status</label>
          <select class="form-select" [(ngModel)]="status" name="status" required>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div class="col-md-6">
          <label class="form-label">Detected At</label>
          <input type="datetime-local" class="form-control" [(ngModel)]="detectedAt" name="detectedAt" required>
        </div>

        <div class="col-md-6">
          <label class="form-label">Resolved At</label>
          <input type="datetime-local" class="form-control" [(ngModel)]="resolvedAt" name="resolvedAt">
        </div>

        <div class="col-12">
          <label class="form-label">Notes (optional)</label>
          <textarea class="form-control" [(ngModel)]="notes" name="notes" rows="2"></textarea>
        </div>

        <div class="col-12">
          <button class="btn btn-outline-success w-100" [disabled]="!formValid()">Save Finding</button>
        </div>

      </form>
    </div>
  `
})
export class AuditFindingFormComponent implements OnChanges {

  @Input() finding?: AuditFinding;
  @Input() projectId = '';
  @Input() checklistItemId = '';

  @Output() save = new EventEmitter<AuditFinding>();
  @Output() close = new EventEmitter<void>();


  title = '';
  description = '';
  severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' = 'open';
  detectedAt = '';
  resolvedAt = '';
  notes = '';

  ngOnChanges() {
    if (this.finding) {
      this.title = this.finding.title;
      this.description = this.finding.description;
      this.severity = this.finding.severity;
      this.status = this.finding.status;
      this.detectedAt = this.finding.detectedAt;
      this.resolvedAt = this.finding.resolvedAt || '';
      this.notes = this.finding.notes || '';
    }
  }

  formValid(): boolean {
    return !!(this.title.trim() && this.severity && this.status && this.detectedAt);
  }

  submit() {
    const finding: AuditFinding = {
      id: this.finding?.id || this.generateId(),
      projectId: this.projectId,
      checklistItemId: this.checklistItemId,
      title: this.title,
      description: this.description,
      severity: this.severity,
      status: this.status,
      detectedAt: this.detectedAt,
      resolvedAt: this.resolvedAt || undefined,
      notes: this.notes || undefined,
    };

    this.save.emit(finding);
    this.close.emit();
  }

  generateId(): string {
    return Math.random().toString(36).substring(2, 12);
  }
}
