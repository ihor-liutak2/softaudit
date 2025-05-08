import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditFinding } from '../core/general/general.types';

@Component({
  selector: 'app-audit-finding-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-3 ps-4 border-start border-3" *ngIf="findings.length > 0">

      @for (finding of findings; track finding.id) {

        <div class="mb-3">

          <div class="d-flex align-items-center gap-2">

            <span class="fw-bold">{{ finding.title }}</span>

            <span class="badge"
                  [ngClass]="{
                    'bg-success': finding.severity === 'low',
                    'bg-warning text-dark': finding.severity === 'medium',
                    'bg-danger': finding.severity === 'high',
                    'bg-dark': finding.severity === 'critical'
                  }">
              {{ finding.severity }}
            </span>

            <span class="badge bg-secondary">
              {{ finding.status }}
            </span>

          </div>

          <div class="text-muted small">
            Detected: {{ finding.detectedAt | date:'short' }}
          </div>

        </div>

      }
    </div>
  `
})
export class AuditFindingListComponent {

  @Input() findings: AuditFinding[] = [];

}
