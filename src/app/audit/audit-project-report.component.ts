import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-audit-project-report',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5">
      <h3>Audit Report</h3>
      <p class="text-muted">Report for project ID: {{ projectId }}</p>

      <!-- Placeholder for future content -->
      <div class="alert alert-info mt-4">
        The report view is under construction. Future content will include audit results, findings, AI recommendations, and PDF export.
      </div>
    </div>
  `
})
export class AuditProjectReportComponent implements OnInit {
  projectId = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
  }
}
