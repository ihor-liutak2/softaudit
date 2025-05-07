import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditChecklistItem } from '../core/general/general.types';

@Component({
  selector: 'app-audit-checklist-selector',
  standalone: true,
  imports: [CommonModule],
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

              <div>
                <div class="fw-bold mb-2">
                  {{ item.title }}
                  
                  <span class="badge rounded-pill"
                        [ngClass]="{
                          'bg-success': item.criticality === 'low',
                          'bg-warning text-dark': item.criticality === 'medium',
                          'bg-danger': item.criticality === 'high'
                        }">
                    {{ item.criticality }}
                  </span>

                  @if (item.standardCompliance) {
                    <span class="badge rounded-pill bg-info text-dark ms-2">
                      Standard: {{ item.standardCompliance }}
                    </span>
                  }
                </div>

                <div class="text-muted">
                  {{ item.description }}
                </div>
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
  @Output() selectionChange = new EventEmitter<Set<string>>();

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
    // Emit updated selection
    this.selectionChange.emit(new Set(this.selectedIds));
  }
  
}
