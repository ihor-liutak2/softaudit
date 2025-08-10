import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReqSpecsItem, StandardRef, UserRef } from './req-specs.types';

@Component({
  selector: 'app-req-specs-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <table class="table table-bordered table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th style="width:28%">Title</th>
          <th style="width:10%">Type</th>
          <th style="width:10%">Priority</th>
          <th style="width:10%">Status</th>
          <th style="width:18%">Standards</th>
          <th style="width:12%">Links</th>
          <th style="width:12%">Created</th>
        </tr>
      </thead>

      <tbody>
        @for (item of items; track item.id) {
          <tr>
            <!-- Title + optional tags -->
            <td>
              <div class="fw-semibold">{{ item.title }}</div>
              <div class="text-muted small" *ngIf="item.description">{{ item.description }}</div>
              <div class="mt-1" *ngIf="item.tags?.length">
                <span
                  class="badge rounded-pill text-bg-light me-1"
                  *ngFor="let t of previewTags(item.tags)">{{ t }}</span>
                <span class="text-muted small" *ngIf="(item.tags?.length || 0) > 3">
                  +{{ (item.tags?.length || 0) - 3 }}
                </span>
              </div>
            </td>

            <!-- Type -->
            <td>{{ item.type }}</td>

            <!-- Priority (colored badge) -->
            <td>
              <span class="badge" [ngClass]="priorityClass(item.priority)">
                {{ item.priority }}
              </span>
            </td>

            <!-- Status (colored badge) -->
            <td>
              <span class="badge" [ngClass]="statusClass(item.status)">
                {{ item.status }}
              </span>
            </td>

            <!-- Standards summary -->
            <td>
              @if (item.standards?.length) {
                <div class="small">
                  {{ standardsSummary(item.standards) }}
                </div>
              } @else {
                <span class="text-muted">—</span>
              }
            </td>

            <!-- First link + total count -->
            <td>
              @if (item.links?.length) {
                <a
                  class="text-decoration-none"
                  [href]="firstLink(item.links)?.url || '#'"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ linkTitle(firstLink(item.links)) }}
                </a>
                <span class="text-muted small" *ngIf="(item.links?.length || 0) > 1">
                  (+{{ (item.links?.length || 0) - 1 }})
                </span>
              } @else {
                <span class="text-muted">—</span>
              }
            </td>

            <!-- Created (date + by) -->
            <td>
              <div>{{ item.createdAt | date:'shortDate' }}</div>
              <div class="text-muted small" *ngIf="creatorLabel(item.createdBy)">
                by {{ creatorLabel(item.createdBy) }}
              </div>
            </td>
          </tr>
        }

        @empty {
          <tr>
            <td colspan="7" class="text-center text-muted py-3">
              No requirements available
            </td>
          </tr>
        }
      </tbody>
    </table>
  `
})
export class ReqSpecsTableComponent {
  @Input() items: ReqSpecsItem[] = [];

  // --- View helpers (UI only) -----------------------------------------------

  /** Returns up to 3 tags for compact preview */
  previewTags(tags: string[] = []): string[] {
    return tags.slice(0, 3);
  }

  /** Maps priority to a Bootstrap badge class */
  priorityClass(p: string): string {
    switch ((p || '').toLowerCase()) {
      case 'must': return 'text-bg-danger';
      case 'should': return 'text-bg-warning';
      case 'could': return 'text-bg-info';
      case "won't":
      case 'wont': return 'text-bg-secondary';
      case 'low': return 'text-bg-secondary';
      case 'medium': return 'text-bg-info';
      case 'high': return 'text-bg-warning';
      case 'critical': return 'text-bg-danger';
      default: return 'text-bg-light';
    }
  }

  /** Maps status to a Bootstrap badge class */
  statusClass(s: string): string {
    switch ((s || '').toLowerCase()) {
      case 'draft': return 'text-bg-secondary';
      case 'in-review': return 'text-bg-warning';
      case 'approved': return 'text-bg-success';
      case 'implemented': return 'text-bg-primary';
      case 'deprecated': return 'text-bg-dark';
      default: return 'text-bg-light';
    }
  }

  /** Builds a short standards summary, handles undefined safely */
  standardsSummary(std?: StandardRef[]): string {
    if (!std || std.length === 0) return '';
    const parts = std
      .map(s => {
        const code = (s.code || '').trim();
        const clause = (s.clause || '').trim();
        return clause ? `${code} §${clause}` : code;
      })
      .filter(Boolean);
    if (parts.length <= 2) return parts.join(', ');
    return `${parts.slice(0, 2).join(', ')} +${parts.length - 2}`;
  }

  /** First link helper to avoid unsafe indexing in the template */
  firstLink(
    links?: Array<{ title: string; url: string }>
  ): { title: string; url: string } | undefined {
    return links && links.length ? links[0] : undefined;
  }

  /** Pretty title for a link, with fallbacks */
  linkTitle(l?: { title: string; url: string }): string {
    if (!l) return 'Open';
    return (l.title && l.title.trim()) || this.hostFromUrl(l.url);
  }

  /** Fallback label from UserRef (name/displayName > email > uid) */
  creatorLabel(u?: UserRef): string | undefined {
    if (!u) return undefined;
    const anyU = u as any;
    return anyU.name || anyU.displayName || u.email || u.uid;
  }

  /** Fallback title from URL host */
  hostFromUrl(url: string): string {
    try {
      return new URL(url).host || url;
    } catch {
      return url;
    }
  }
}
