import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReqSpecsItem } from './req-specs.types';

@Component({
  selector: 'app-req-specs-item-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form (ngSubmit)="submit()" class="p-3 border rounded bg-light">
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input class="form-control" [(ngModel)]="item.title" name="title" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea class="form-control" [(ngModel)]="item.description" name="description" rows="3"></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Type</label>
        <select class="form-select" [(ngModel)]="item.type" name="type" required>
          <option value="functional">Functional</option>
          <option value="non-functional">Non-Functional</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Priority</label>
        <select class="form-select" [(ngModel)]="item.priority" name="priority" required>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Status</label>
        <select class="form-select" [(ngModel)]="item.status" name="status" required>
          <option value="proposed">Proposed</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="implemented">Implemented</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">Document URL</label>
        <input class="form-control" [(ngModel)]="item.documentUrl" name="documentUrl" />
      </div>

      <div class="mb-3">
        <label class="form-label">Document Description</label>
        <input class="form-control" [(ngModel)]="item.documentDescription" name="documentDescription" />
      </div>

      <div class="mb-3">
        <label class="form-label">Notes</label>
        <textarea class="form-control" [(ngModel)]="item.notes" name="notes" rows="2"></textarea>
      </div>

      <div class="text-end">
        <button class="btn btn-outline-success" type="submit" [disabled]="!formValid()">Save</button>
      </div>
    </form>
  `
})
export class ReqSpecsItemFormComponent {
  @Input() model?: Partial<ReqSpecsItem>;
  @Input() projectId!: string;
  @Input() createdBy!: string;
  @Input() parentId?: string;

  @Output() saved = new EventEmitter<ReqSpecsItem>();

  item: ReqSpecsItem = {
    id: '',
    projectId: '',
    title: '',
    description: '',
    type: 'functional',
    priority: 'medium',
    status: 'proposed',
    createdAt: '',
    createdBy: '',
  };

  ngOnInit() {
    this.item = {
      ...this.item,
      ...this.model,
      projectId: this.projectId,
      createdBy: this.createdBy,
      parentId: this.parentId,
      createdAt: this.model?.createdAt ?? new Date().toISOString(),
    };
  }

  formValid(): boolean {
    return !!this.item.title && !!this.item.projectId && !!this.item.createdBy;
  }

  submit() {
    this.saved.emit(this.item);
  }
}
