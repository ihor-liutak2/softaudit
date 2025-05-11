import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuditChecklistItem, AuditFinding } from '../core/general/general.types';
import { AuditService } from './audit.service';
import { AuditFindingFormComponent } from './audit-finding-form.component';
import { VertexAiService } from '../core/general/vertex-ai.service';

@Component({
  selector: 'app-audit-project-findings',
  standalone: true,
  imports: [CommonModule, AuditFindingFormComponent],
  template: `
    <div class="container py-5">

      <h3>Audit Checklist & Findings</h3>

      <table class="table align-middle table-hover">
        <thead class="table-light">
          <tr>
            <th>Title</th>
            <th>Section</th>
            <th>Subsection</th>
            <th>Criticality</th>
            <th>Findings</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          @for (item of checklistItems(); track item.id) {
            <tr>
              <td class="fw-bold">{{ item.title }}</td>
              <td>{{ item.section }}</td>
              <td>{{ item.subsection }}</td>
              <td>
                <span class="badge" [ngClass]="{
                  'bg-success': item.criticality === 'low',
                  'bg-warning text-dark': item.criticality === 'medium',
                  'bg-danger': item.criticality === 'high'
                }">{{ item.criticality }}</span>
              </td>
              <td>
                <ul class="list-unstyled mb-0">
                  @for (finding of getFindings(item.id); track finding.id) {
                    <li>
                      <strong>{{ finding.title }}</strong>
                      <span class="badge bg-secondary ms-1">{{ finding.status }}</span>
                      <span class="badge bg-danger ms-1">{{ finding.severity }}</span>
                      <button class="btn btn-sm btn-link" (click)="editFinding(finding)">Edit</button>
                    </li>
                  }
                </ul>
              </td>
              <td>
                <button class="btn btn-sm btn-outline-success" (click)="openAddFinding(item)">Add Finding</button>
              </td>
            </tr>
          }
        </tbody>
      </table>

      <!-- Modal -->
      <div *ngIf="showForm()" class="modal fade show d-block" tabindex="-1" role="dialog" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">

            <div class="modal-header">
              <h5 class="modal-title">Add Finding</h5>
              <button type="button" class="btn-close" (click)="closeModal()" aria-label="Close"></button>
            </div>

            <div class="modal-body">
              <app-audit-finding-form
                [projectId]="projectId"
                [checklistItemId]="selectedChecklistItem()?.id || ''"
                [finding]="selectedFinding() || undefined"
                (save)="onSaveFinding($event)"
                (close)="closeModal()"
                (aiSuggest)="onSuggestFinding($event)">
              </app-audit-finding-form>
            </div>  

          </div>
        </div>
      </div>

    </div>
  `
})
export class AuditProjectFindingsComponent implements OnInit {

  projectId = '';
  checklistItems = signal<AuditChecklistItem[]>([]);
  findings = signal<AuditFinding[]>([]);

  selectedChecklistItem = signal<AuditChecklistItem | null>(null);
  showForm = signal(false);

  selectedFinding = signal<AuditFinding | null>(null);
  aiNotesLoading = signal(false);

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService,
    private vertexAiService: VertexAiService
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

  getFindings(itemId: string): AuditFinding[] {
    return this.findings().filter(f => f.checklistItemId === itemId);
  }

  openAddFinding(item: AuditChecklistItem) {
    this.selectedChecklistItem.set(item); 
    this.showForm.set(true);
  }

  editFinding(finding: AuditFinding) {
    this.selectedFinding.set(finding);
    const checklistItem = this.checklistItems().find(i => i.id === finding.checklistItemId) || null;
    this.selectedChecklistItem.set(checklistItem);
    this.showForm.set(true);
  }  

  closeForm() {
    this.showForm.set(false);
    this.selectedChecklistItem.set(null);
  }

  onSaveFinding(finding: AuditFinding) {
    this.auditService.saveFinding(finding).then(() => {
      const existing = this.findings().filter(f => f.id !== finding.id);
      this.findings.set([...existing, finding]);
      this.showForm.set(false);
    });
  }
  
  closeModal() {
    this.showForm.set(false);
    this.selectedChecklistItem.set(null);
    this.selectedFinding.set(null);
  }  

  onSuggestFinding(data: { title: string; description: string }) {
    this.aiNotesLoading.set(true);
    this.vertexAiService.suggestFindingNotes(data.title, data.description).subscribe({
      next: (result) => {
        const current = this.selectedFinding();
        if (current) {
          this.selectedFinding.set({ ...current, notes: result });
        }
        this.aiNotesLoading.set(false);
      },
      error: (err) => {
        console.error('AI suggestion error:', err);
        this.aiNotesLoading.set(false);
      }
    });
  }  
  
}
