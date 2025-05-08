import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditChecklistItem, AuditFinding } from '../core/general/general.types';
import { AuditFindingListComponent } from './audit-finding-list.component';

@Component({
  selector: 'app-audit-checklist-selector',
  standalone: true,
  imports: [CommonModule, AuditFindingListComponent],
  template: `
    <div class="d-flex justify-content-end mb-4 gap-3">
      <button class="btn btn-outline-danger btn-sm" (click)="selectByCriticality(['high'])">Select all HIGH</button>
      <button class="btn btn-outline-warning btn-sm" (click)="selectByCriticality(['high', 'medium'])">Select all HIGH + MEDIUM</button>
    </div>

    @for (subsection of subsections; track subsection) {

      <div class="checklist-group mb-5">
        <h5 class="mb-3 border-bottom pb-2">{{ subsection }}</h5>

        @for (item of groupedItems[subsection]; track item.id) {

          <div class="checklist-item mb-4 p-4 border rounded bg-white shadow-sm">

            <label class="d-flex align-items-start gap-3">
              <input type="checkbox" [checked]="selectedIds.has(item.id)" (change)="toggleItem(item.id)" class="form-check-input mt-1">

              <div class="w-100">
                <div class="d-flex align-items-center mb-2 gap-2">
                  <div class="fw-bold">
                    {{ item.title }}
                  </div>

                  <span class="badge rounded-pill"
                        [ngClass]="{
                          'bg-success': item.criticality === 'low',
                          'bg-warning text-dark': item.criticality === 'medium',
                          'bg-danger': item.criticality === 'high'
                        }">
                    {{ item.criticality }}
                  </span>

                  @if (item.standardCompliance) {
                    <span class="badge rounded-pill bg-info text-dark">
                      {{ item.standardCompliance }}
                    </span>
                  }

                  @if (getFindingCount(item.id) > 0) {
                    <span class="badge rounded-pill bg-primary ms-auto">
                      {{ getFindingCount(item.id) }} Findings
                    </span>
                  }
                </div>

                <div class="text-muted">
                  {{ item.description }}
                </div>

                <!-- Show / Hide findings button -->
                @if (getFindingCount(item.id) > 0) {
                  <button class="btn btn-sm btn-outline-secondary mt-2" (click)="toggleFinding(item.id)">
                    @if (expandedFindings.has(item.id)) { Hide Findings } @else { Show Findings }
                  </button>
                }

                <!-- Findings list -->
                <app-audit-finding-list
                  *ngIf="expandedFindings.has(item.id)"
                  [findings]="getFindings(item.id)">
                </app-audit-finding-list>

              </div>
            </label>

          </div>

        }
      </div>

    }
  `
})
export class AuditChecklistSelectorComponent {

  @Input() items: AuditChecklistItem[] = [];
  @Input() selectedIds = new Set<string>();
  @Input() findingsCount: { [checklistItemId: string]: number } = {};
  @Input() findingsMap: { [checklistItemId: string]: AuditFinding[] } = {};

  @Output() selectionChange = new EventEmitter<Set<string>>();

  expandedFindings = new Set<string>();

  get groupedItems() {
    const grouped: { [key: string]: AuditChecklistItem[] } = {};
    for (const item of this.items) {
      const subsection = item.subsection || 'General';
      if (!grouped[subsection]) {
        grouped[subsection] = [];
      }
      grouped[subsection].push(item);
    }
    return grouped;
  }

  get subsections() {
    return Object.keys(this.groupedItems);
  }

  toggleItem(itemId: string) {
    if (this.selectedIds.has(itemId)) {
      this.selectedIds.delete(itemId);
    } else {
      this.selectedIds.add(itemId);
    }
    this.selectionChange.emit(new Set(this.selectedIds));
  }

  selectByCriticality(levels: ('low' | 'medium' | 'high')[]) {
    for (const subsection of this.subsections) {
      for (const item of this.groupedItems[subsection]) {
        if (levels.includes(item.criticality)) {
          this.selectedIds.add(item.id);
        }
      }
    }
    this.selectionChange.emit(new Set(this.selectedIds));
  }

  getFindingCount(itemId: string): number {
    return this.findingsMap[itemId]?.length || 0;
  }

  getFindings(itemId: string): AuditFinding[] {
    return this.findingsMap[itemId] || [];
  }

  toggleFinding(itemId: string) {
    if (this.expandedFindings.has(itemId)) {
      this.expandedFindings.delete(itemId);
    } else {
      this.expandedFindings.add(itemId);
    }
  }
}
