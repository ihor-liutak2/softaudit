import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidationItem } from './validation.types';
import { ReqSpecsService } from '../requirements_specs/req-specs.service';

@Component({
  selector: 'app-validation-item-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form class="p-4 border rounded bg-light">
      <h5 class="mb-3">Validation Item</h5>

      <div class="mb-3">
        <label class="form-label">Title</label>
        <input type="text" class="form-control" [(ngModel)]="item.title" name="title">
      </div>

      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea class="form-control" rows="3" [(ngModel)]="item.description" name="description"></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Type</label>
        <select class="form-select" [(ngModel)]="item.type" name="type">
          <option value="unit">Unit</option>
          <option value="integration">Integration</option>
          <option value="system">System</option>
          <option value="user_acceptance">User Acceptance</option>
          <option value="regression">Regression</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Method</label>
        <select class="form-select" [(ngModel)]="item.method" name="method">
          <option value="manual">Manual</option>
          <option value="automated">Automated</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Tool</label>
        <input type="text" class="form-control" [(ngModel)]="item.tool" name="tool">
      </div>

      <div class="mb-3">
        <label class="form-label">Status</label>
        <select class="form-select" [(ngModel)]="item.status" name="status">
          <option value="pending">Pending</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
          <option value="skipped">Skipped</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Severity</label>
        <select class="form-select" [(ngModel)]="item.severity" name="severity">
          <option value="">-- Select --</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Expected Result</label>
        <textarea class="form-control" rows="2" [(ngModel)]="item.expectedResult" name="expectedResult"></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Actual Result</label>
        <textarea class="form-control" rows="2" [(ngModel)]="item.actualResult" name="actualResult"></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Related Requirement ID</label>
        <input type="text" class="form-control" [(ngModel)]="item.requirementId" name="requirementId">
      </div>

      <div class="mb-3">
        <label class="form-label">Notes</label>
        <textarea class="form-control" rows="2" [(ngModel)]="item.notes" name="notes"></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">External Documents</label>
        <div *ngFor="let doc of item.externalDocs; let i = index" class="d-flex gap-2 mb-2">
          <input type="text" class="form-control" [(ngModel)]="doc.url" [name]="'docUrl' + i" placeholder="URL">
          <input type="text" class="form-control" [(ngModel)]="doc.description" [name]="'docDesc' + i" placeholder="Description">
        </div>
        <button class="btn btn-sm btn-outline-secondary" type="button" (click)="addExternalDoc()">+ Add Document</button>
      </div>

      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  `
})
export class ValidationItemFormComponent implements OnInit {
  @Input() projectId = '';
  @Input() item: ValidationItem = {
    id: '',
    projectId: '',
    title: '',
    type: 'unit',
    method: 'manual',
    status: 'pending',
    createdBy: '',
    createdAt: new Date().toISOString(),
    externalDocs: []
  };

  constructor(private reqSpecsService: ReqSpecsService) { }

  ngOnInit(): void {
    if (this.projectId) {
      this.item.projectId = this.projectId;
    }
  }

  addExternalDoc() {
    this.item.externalDocs = [...(this.item.externalDocs || []), { url: '' }];
  }
}
