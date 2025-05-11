import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditFinding, AuditFindingTemplate } from '../core/general/general.types';
import { AUDIT_FINDING_TEMPLATES } from '../core/utils/audit-finding';

@Component({
  selector: 'app-audit-finding-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 border rounded">

      <h5 class="fw-bold mb-3">{{ finding?.id ? 'Edit Finding' : 'Add Finding' }}</h5>

      <form (ngSubmit)="submit()" class="row g-3">

        <div class="col-12">
          <label class="form-label d-flex justify-content-between align-items-center">
            Title
            <button type="button" class="btn btn-sm btn-outline-info ms-2" (click)="toggleSuggestions()" title="Suggest findings">
              <i class="bi bi-lightbulb"></i>
            </button>
          </label>

          <input type="text" class="form-control" [(ngModel)]="title" name="title" required>

          @if (showSuggestions()) {
            <p class="mt-2 text-info">Select possible suggestions</p>
            <ul class="list-group mt-2">
              @for (suggestion of filteredSuggestions(); track suggestion.id) {
                <li
                  class="list-group-item list-group-item-action text-info"
                  (click)="applySuggestion(suggestion)">
                  {{ suggestion.title }}
                </li>
              }
            </ul>
          }
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
          <div class="d-flex justify-content-between align-items-center mb-2">
            <label class="form-label">Notes (optional)</label>

            <button
              *ngIf="finding?.id && !notes.trim()"
              type="button"
              class="btn btn-sm btn-outline-info ms-2"
              (click)="aiSuggest.emit({ title, description })">
              <i class="bi bi-robot"></i> Suggest
            </button>
          </div>
          <textarea class="form-control" [(ngModel)]="notes" name="notes" rows="2"></textarea>
        </div>

        <div class="col-12">
          <button class="btn btn-outline-success w-100" [disabled]="!formValid()">Save Finding</button>
        </div>

      </form>
    </div>
  `
})
export class AuditFindingFormComponent {
  @Input() finding?: AuditFinding;
  @Input() projectId = '';
  @Input() checklistItemId = '';

  @Output() save = new EventEmitter<AuditFinding>();
  @Output() close = new EventEmitter<void>();
  @Output() aiSuggest = new EventEmitter<{ title: string; description: string }>();

  suggestions = AUDIT_FINDING_TEMPLATES;
  showingSuggestions = signal(false);

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
      ...(this.resolvedAt && { resolvedAt: this.resolvedAt }),
      ...(this.notes?.trim() && { notes: this.notes.trim() })
    };

    this.save.emit(finding);
    this.close.emit();
  }

  generateId(): string {
    return Math.random().toString(36).substring(2, 12);
  }

  toggleSuggestions() {
    this.showingSuggestions.set(!this.showingSuggestions());
  }

  showSuggestions(): boolean {
    return this.showingSuggestions();
  }

  filteredSuggestions(): AuditFindingTemplate[] {
    return this.suggestions.filter(t => t.checklistItemId === this.checklistItemId);
  }

  applySuggestion(template: AuditFindingTemplate) {
    this.title = template.title;
    this.description = template.description;
    this.severity = template.severity;
    this.showingSuggestions.set(false);
  }
}
