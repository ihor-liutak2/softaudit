import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuditService } from './audit.service';
import { AuditChecklistItem, AuditFinding } from '../core/general/general.types';

@Component({
  selector: 'app-audit-project-findings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-5">

      <h3>Audit Checklist & Findings</h3>

      @if (!projectId) {
        <p class="text-danger">Project ID is missing</p>
      }

      @if (checklistItems().length === 0) {
        <p>No checklist items found for this project.</p>
      }

      <div *ngFor="let item of checklistItems()" class="mb-5 p-4 border rounded bg-white shadow-sm">

        <h5>{{ item.title }}</h5>
        <p class="text-muted">{{ item.description }}</p>

        <!-- Findings for this checklist item -->
        <h6 class="mt-3">Findings:</h6>

        @if (getFindings(item.id).length === 0) {
          <p class="text-muted">No findings yet.</p>
        }

        <ul class="list-group mb-3" *ngIf="getFindings(item.id).length > 0">
          <li class="list-group-item d-flex justify-content-between align-items-center"
              *ngFor="let finding of getFindings(item.id)">

            <div>
              <strong>{{ finding.title }}</strong> 
              <span class="badge bg-secondary ms-2">{{ finding.status }}</span>
              <span class="badge bg-danger ms-2">{{ finding.severity }}</span>
            </div>

            <button class="btn btn-sm btn-outline-primary" (click)="editFinding(finding)">Edit</button>

          </li>
        </ul>

        <button class="btn btn-sm btn-outline-success" (click)="addFinding(item)">Add Finding</button>

      </div>
    </div>
  `
})
export class AuditProjectFindingsComponent implements OnInit {

  projectId = '';
  checklistItems = signal<AuditChecklistItem[]>([]);
  findings = signal<AuditFinding[]>([]);

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService
  ) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';

    if (this.projectId) {
      this.loadChecklistItems();
      this.loadFindings();
    }
  }

  async loadChecklistItems() {
    const items = await this.auditService.getChecklistItems(this.projectId);
    this.checklistItems.set(items);
}

  async loadFindings() {
    const findings = await this.auditService.getFindingsForProject(this.projectId);
    this.findings.set(findings);
  }

  getFindings(checklistItemId: string): AuditFinding[] {
    return this.findings().filter(f => f.checklistItemId === checklistItemId);
  }

  addFinding(item: AuditChecklistItem) {
    const title = prompt('Enter finding title');
    if (!title) return;

    const newFinding: AuditFinding = {
      id: crypto.randomUUID(),
      projectId: this.projectId,
      checklistItemId: item.id,
      title: title,
      description: '',
      severity: 'medium',
      status: 'open',
      detectedAt: new Date().toISOString()
    };

    this.auditService.saveFinding(newFinding).then(() => {
      this.findings.set([...this.findings(), newFinding]);
    });
  }

  editFinding(finding: AuditFinding) {
    const newTitle = prompt('Edit finding title', finding.title);
    if (!newTitle) return;

    const updatedFinding = { ...finding, title: newTitle };

    this.auditService.saveFinding(updatedFinding).then(() => {
      const updatedList = this.findings().map(f => f.id === updatedFinding.id ? updatedFinding : f);
      this.findings.set(updatedList);
    });
  }
}
