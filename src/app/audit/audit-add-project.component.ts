import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuditService } from './audit.service';
import { UserService } from '../core/user/user.service';
import { ProjectFormComponent } from './audit-project-form.component';
import { AuditChecklistSelectorComponent } from './audit-checklist-selector.component';
import { AuditChecklistItem, AuditProject } from '../core/general/general.types';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectFormComponent, AuditChecklistSelectorComponent],
  template: `
    <div class="container py-5">
      @if (accessDenied()) {
        <h3 class="text-danger">Access denied</h3>
        <p>You do not have access to edit this project.</p>
      } @else {

        <h3 *ngIf="isEditMode">Edit Audit Project</h3>
        <h3 *ngIf="!isEditMode">Add Audit Project</h3>

        @if (!showChecklistSelector) {
          <app-project-form 
            [companies]="companies()"
            [sectors]="sectors()"
            [authorEmail]="currentUserEmail"
            [project]="createdProject"
            (save)="onSave($event)">
          </app-project-form>
        }

        @if (showChecklistSelector && checklistStep === 'object') {
          <h4>Select OBJECT Checklist Items</h4>
          <app-audit-checklist-selector
            [items]="objectChecklistItems()"
            [selectedIds]="selectedObjectChecklistItems"
            (selectionChange)="onObjectChecklistChange($event)">
          </app-audit-checklist-selector>

          <button class="btn btn-primary mt-3" (click)="nextStep()">Next: Process Checklist</button>
        }

        @if (showChecklistSelector && checklistStep === 'process') {
          <h4>Select PROCESS Checklist Items</h4>
          <app-audit-checklist-selector
            [items]="processChecklistItems()"
            [selectedIds]="selectedProcessChecklistItems"
            (selectionChange)="onProcessChecklistChange($event)">
          </app-audit-checklist-selector>

          <button class="btn btn-success mt-3" (click)="finish()">Finish and Save</button>
        }

      }
    </div>
  `
})
export class AddProjectComponent implements OnInit {

  companies = computed(() => this.auditService.companies());
  sectors = computed(() => this.auditService.sectors());
  checklistItems = computed(() => this.auditService.checklistItems());

  currentUserEmail = '';
  currentUserRole = '';

  showChecklistSelector = false;
  checklistStep: 'object' | 'process' = 'object';

  selectedObjectChecklistItems = new Set<string>();
  selectedProcessChecklistItems = new Set<string>();

  createdProject?: AuditProject;

  isEditMode = false;
  accessDenied = signal(false);

  constructor(
    private auditService: AuditService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.auditService.loadCompanies();
    this.auditService.loadSectors();

    this.currentUserEmail = this.userService.userEmail;
    this.currentUserRole = this.userService.user?.role || '';

    const projectId = this.route.snapshot.paramMap.get('id');

    if (projectId) {
      this.isEditMode = true;

      this.auditService.getAuditProjectById(projectId).then(project => {

        if (!project) {
          this.accessDenied.set(true);
          return;
        }

        // If not admin → check if user is in auditTeam
        if (this.currentUserRole !== 'admin' && !project.auditTeam.includes(this.currentUserEmail)) {
          this.accessDenied.set(true);
          return;
        }

        this.createdProject = project;

      });
    }
  }

  onSave(project: AuditProject) {
    this.auditService.saveAuditProject(project).then(() => {
      this.createdProject = project;
      this.showChecklistSelector = true;
      this.checklistStep = 'object';
    });
  }

  objectChecklistItems() {
    return this.checklistItems().filter(item => item.section === 'object');
  }

  processChecklistItems() {
    return this.checklistItems().filter(item => item.section === 'process');
  }

  onObjectChecklistChange(selected: Set<string>) {
    this.selectedObjectChecklistItems = selected;
  }

  onProcessChecklistChange(selected: Set<string>) {
    this.selectedProcessChecklistItems = selected;
  }

  nextStep() {
    this.checklistStep = 'process';
  }

  finish() {
    const allSelected = [
      ...Array.from(this.selectedObjectChecklistItems),
      ...Array.from(this.selectedProcessChecklistItems)
    ];

    console.log('All selected checklist items:', allSelected);

    alert('Project and checklist selections completed!');

    // TODO: Save checklist items to Firestore
    this.showChecklistSelector = false;
  }
}
