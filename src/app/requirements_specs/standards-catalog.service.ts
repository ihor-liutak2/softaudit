// src/app/requirements_specs/standards-catalog.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { StandardRef, StdCatalog, StdClause, StdSpec } from './req-specs.types';


@Injectable({ providedIn: 'root' })
export class StandardsCatalogService {
  private http = inject(HttpClient);

  // Signals for caching
  catalog = signal<StdCatalog | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  /**
   * Loads the catalog from assets only once (subsequent calls return cached data).
   */
  async load(): Promise<void> {
    if (this.catalog()) return; // already loaded/cached

    this.loading.set(true);
    this.error.set(null);
    try {
      // Adjust path if you put catalog elsewhere
      const data = await firstValueFrom(
        this.http.get<StdCatalog>('/assets/standards/catalog.json')
      );
      this.catalog.set(data);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Failed to load standards catalog');
    } finally {
      this.loading.set(false);
    }
  }

  /** Returns the list of standards from catalog (empty array if not loaded). */
  standards(): StdSpec[] {
    return this.catalog()?.standards ?? [];
  }

  /** Finds a standard by its `id` (not by `code`). */
  findStandardById(id: string | undefined): StdSpec | undefined {
    if (!id) return undefined;
    return this.standards().find(s => s.id === id);
  }

  /** Returns clauses of a specific standard (by `id`). */
  clausesOf(stdId: string | undefined): StdClause[] {
    return this.findStandardById(stdId)?.clauses ?? [];
  }

  /**
   * Converts a (standardId, clauseId) pair from the catalog into your app's
   * StandardRef (code + clause + a human-friendly note).
   */
  toRef(standardId: string, clauseId: string): StandardRef | null {
    const std = this.findStandardById(standardId);
    const clause = std?.clauses.find(c => c.id === clauseId);
    if (!std || !clause) return null;

    return {
      code: std.code,         // e.g. "ISO/IEC 25010"
      clause: clause.code,    // e.g. "PE.TimeBehavior"
      note: clause.title,     // human-friendly title for display
    };
  }

  // Get a standard by its id using the public list
  standardById(id?: string) {
    if (!id) return undefined;
    return this.standards().find(s => s.id === id);
  }

  // Get a clause by standard id + clause id using the public helper
  clauseById(stdId?: string, clauseId?: string) {
    if (!stdId || !clauseId) return undefined;
    const clauses = this.clausesOf(stdId);
    return clauses.find((c: { id: string }) => c.id === clauseId);
  }

  /** Map StandardRef[] -> list of srsSection strings (deduped) */
  mapsToSectionsFor(refs: StandardRef[] | undefined): string[] {
    if (!refs?.length) return [];
    const t = (v?: string) => (v ?? '').trim().toLowerCase();
    const out = new Set<string>();

    for (const r of refs) {
      const code = t(r.code);
      const clauseCode = t(r.clause);
      if (!code) continue;

      // find std by code
      const std = this.standards().find(s => (s.code || '').trim().toLowerCase() === code);
      if (!std) continue;

      // clause by clause.code (optional)
      const clauses = clauseCode
        ? std.clauses.filter(c => (c.code || '').trim().toLowerCase() === clauseCode)
        : std.clauses;

      for (const c of clauses) {
        (c.mapsTo || [])
          .filter(m => m.type === 'srsSection' && m.value)
          .forEach(m => out.add(m.value));
      }
    }
    return Array.from(out);
  }

  /** Map StandardRef[] -> list of qualityRule strings (deduped) */
  mapsToQualityRulesFor(refs: StandardRef[] | undefined): string[] {
    if (!refs?.length) return [];
    const t = (v?: string) => (v ?? '').trim().toLowerCase();
    const out = new Set<string>();

    for (const r of refs) {
      const code = t(r.code);
      const clauseCode = t(r.clause);
      if (!code) continue;

      const std = this.standards().find(s => (s.code || '').trim().toLowerCase() === code);
      if (!std) continue;

      const clauses = clauseCode
        ? std.clauses.filter(c => (c.code || '').trim().toLowerCase() === clauseCode)
        : std.clauses;

      for (const c of clauses) {
        (c.mapsTo || [])
          .filter(m => m.type === 'qualityRule' && m.value)
          .forEach(m => out.add(m.value));
      }
    }
    return Array.from(out);
  }

}
