import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReqSpecsItem } from './req-specs.types';

@Component({
  selector: 'app-req-specs-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <table class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th>Title</th>
          <th>Type</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Created</th>
          <th>Document</th>
        </tr>
      </thead>
      <tbody>
        @for (item of items; track item.id) {
          <tr>
            <td>{{ item.title }}</td>
            <td>{{ item.type }}</td>
            <td><span class="badge bg-info">{{ item.priority }}</span></td>
            <td><span class="badge bg-secondary">{{ item.status }}</span></td>
            <td>{{ item.createdAt | date: 'shortDate' }}</td>
            <td>
              @if (item.documentUrl) {
                <a [href]="item.documentUrl" target="_blank">Open</a>
              } @else {
                <span class="text-muted">—</span>
              }
            </td>
          </tr>
        }
        @empty {
          <tr><td colspan="6" class="text-center text-muted py-3">No requirements available</td></tr>
        }
      </tbody>
    </table>
  `
})
export class ReqSpecsTableComponent {
  @Input() items: ReqSpecsItem[] = [];
}
