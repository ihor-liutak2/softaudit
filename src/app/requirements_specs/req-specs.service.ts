import { Injectable, signal, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  CollectionReference,
  DocumentData,
  query,
  where,
} from '@angular/fire/firestore';
import { ReqSpecsItem, ReqSpecsProject } from './req-specs.types';
import { Company } from '../core/general/general.types';
import { VOCABULARY_SECTORS } from '../core/utils/vocabulary';
import { COLL_REQSPECS_PROJECTS, COLL_COMPANIES } from './req-specs.collections';
import { AppUser } from '../core/user/user.model';
import { omitUndefinedDeep } from './req-specs-utils.function';
import { UserService } from '../core/user/user.service';

@Injectable({ providedIn: 'root' })
export class ReqSpecsService {
  private readonly firestore = inject(Firestore);
  private readonly userService = inject(UserService);

  // In-memory state using signals
  sectors = signal(
    VOCABULARY_SECTORS.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description ?? '',
    })),
  );
  projects = signal<ReqSpecsProject[]>([]);
  companies = signal<Company[]>([]);

  // Typed collection references (AngularFire-only)
  private get projectsCol(): CollectionReference<DocumentData> {
    return collection(this.firestore, COLL_REQSPECS_PROJECTS);
  }
  private get companiesCol(): CollectionReference<DocumentData> {
    return collection(this.firestore, COLL_COMPANIES);
  }

  // --- Utilities -------------------------------------------------------------

  /** Returns current time in ISO format once */
  private now(): string {
    return new Date().toISOString();
  }

  /** Removes empty optional arrays/fields to keep Firestore docs tidy */
  private cleanProject<T extends ReqSpecsProject>(p: T): T {
    const copy: any = { ...p };
    const maybeEmptyArrays: Array<keyof T> = ['tags', 'standards', 'stakeholders'] as any;

    for (const key of maybeEmptyArrays) {
      const v = copy[key as string];
      if (Array.isArray(v) && v.length === 0) delete copy[key as string];
    }
    if (!copy.companyId) delete copy.companyId;
    if (!copy.sectorId) delete copy.sectorId;
    if (!copy.deadlineAt) delete copy.deadlineAt;

    return copy;
  }

  // --- Queries / Commands ----------------------------------------------------

  /** Loads all ReqSpecs projects into signal state */
  /** Load projects visible to the current user (admin → all; others → own ∪ stakeholder) */
  async loadAllProjects(): Promise<void> {
    // Reset list first to avoid showing stale data while loading
    this.projects.set([]);

    const user = this.userService.user; // AppUser | undefined
    if (!user) {
      // Not signed in (should be prevented by rules/guards)
      return;
    }

    const collRef = collection(this.firestore, COLL_REQSPECS_PROJECTS);

    // Admin → load all projects
    if (user.role === 'admin') {
      const allSnap = await getDocs(collRef);
      this.projects.set(allSnap.docs.map(d => d.data() as ReqSpecsProject));
      return;
    }

    // Non-admin → union of (owner) ∪ (stakeholder)
    const ownerQ = query(collRef, where('createdBy.uid', '==', user.uid));
    const stakeQ = query(collRef, where('stakeholderUids', 'array-contains', user.uid));

    const [ownerSnap, stakeSnap] = await Promise.all([
      getDocs(ownerQ),
      getDocs(stakeQ),
    ]);

    const byId = new Map<string, ReqSpecsProject>();
    ownerSnap.forEach(doc => byId.set(doc.id, doc.data() as ReqSpecsProject));
    stakeSnap.forEach(doc => byId.set(doc.id, doc.data() as ReqSpecsProject));

    this.projects.set([...byId.values()]);
  }

  /** Returns project by id or undefined if not found */
  async getProjectById(projectId: string): Promise<ReqSpecsProject | undefined> {
    const ref = doc(this.projectsCol, projectId);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as ReqSpecsProject) : undefined;
  }

  /**
   * Creates or updates a project.
   * - Generates id if missing
   * - Sets createdAt only on first create
   * - Always updates updatedAt
   * - Returns final project id
   */
  /** Save (create/update) project with denormalized stakeholderUids */
  async saveProject(p: ReqSpecsProject): Promise<void> {
    const id = p.id;
    const ref = doc(this.firestore, `${COLL_REQSPECS_PROJECTS}/${id}`);

    // Resolve stakeholder UIDs (by uid/contact)
    const stakeholderUids = await this.deriveStakeholderUids(p);

    // Sanitize stakeholders and strip empties
    const stakeholders = (p.stakeholders ?? [])
      .map(s => ({
        uid: s.uid?.trim() || undefined,
        name: (s.name ?? '').trim(),
        role: s.role === 'editor' || s.role === 'viewer' ? s.role : 'viewer',
        contact: s.contact?.trim() || undefined,
      }))
      .filter(s => s.name);

    // Build payload – may still contain undefined from the spread of p
    const payload: ReqSpecsProject = {
      ...p, // brings optional props that might be undefined
      stakeholders: stakeholders.length ? stakeholders : undefined,
      stakeholderUids,
      updatedAt: new Date().toISOString(),
    };

    // IMPORTANT: remove every `undefined` key before writing
    const clean = omitUndefinedDeep(payload);

    await setDoc(ref, clean, { merge: false });
  }


  /** Delete project by ID */
  async deleteProject(id: string): Promise<void> {
    const ref = doc(this.firestore, `${COLL_REQSPECS_PROJECTS}/${id}`);
    await deleteDoc(ref);
  }

  /**
   * Load projects visible to a given user:
   * - admin: all
   * - non-admin: owner OR stakeholder (two queries + local merge)
   */
  async loadProjectsForUser(user: AppUser): Promise<ReqSpecsProject[]> {
    const coll = collection(this.firestore, COLL_REQSPECS_PROJECTS) as CollectionReference<DocumentData>;

    if (user.role === 'admin') {
      const snap = await getDocs(coll);
      return snap.docs.map(d => d.data() as ReqSpecsProject);
    }

    const ownedQ = query(coll, where('createdBy.uid', '==', user.uid));
    const memberQ = query(coll, where('stakeholderUids', 'array-contains', user.uid));

    const [ownedSnap, memberSnap] = await Promise.all([getDocs(ownedQ), getDocs(memberQ)]);
    const map = new Map<string, ReqSpecsProject>();
    ownedSnap.docs.forEach(d => map.set(d.id, d.data() as ReqSpecsProject));
    memberSnap.docs.forEach(d => map.set(d.id, d.data() as ReqSpecsProject));
    return Array.from(map.values());
  }


  /** Lazy-loads companies list (used for project/company pickers) */
  async loadCompanies(): Promise<void> {
    if (this.companies().length) return;
    const snap = await getDocs(this.companiesCol);
    this.companies.set(snap.docs.map(d => d.data() as Company));
  }

  /** Aggregate project estimates by selected mode (points or time) */
  computeProjectEstimates(
    project: ReqSpecsProject,
    items: ReqSpecsItem[]
  ): {
    mode: 'points' | 'time',
    total: number,
    done: number,
    remaining: number,
    progressPct: number
  } {
    const mode: 'points' | 'time' = project.estimationMode ?? 'points';

    const isDone = (s?: string) => (s ?? '').toLowerCase() === 'implemented';

    if (mode === 'points') {
      const total = items.reduce((sum, r) => sum + (r.estimatePoints ?? 0), 0);
      const done  = items.reduce((sum, r) => sum + (isDone(r.status) ? (r.estimatePoints ?? 0) : 0), 0);
      const remaining = Math.max(0, total - done);
      const progressPct = total ? Math.round((done / total) * 100) : 0;
      return { mode, total, done, remaining, progressPct };
    } else {
      const total = items.reduce((sum, r) => sum + (r.estimateHours ?? 0), 0);

      // If remainingHours is provided on any item, prefer it for remaining calc
      const remainingFromItems = items
        .map(r => r.remainingHours)
        .filter((v): v is number => typeof v === 'number')
        .reduce((a, b) => a + b, 0);

      const hasRemaining = items.some(r => typeof r.remainingHours === 'number');

      const done = hasRemaining
        ? Math.max(0, total - remainingFromItems)
        : items.reduce((sum, r) => sum + (isDone(r.status) ? (r.estimateHours ?? 0) : 0), 0);

      const remaining = Math.max(0, total - done);
      const progressPct = total ? Math.round((done / total) * 100) : 0;
      return { mode, total, done, remaining, progressPct };
    }
  }

  // --- Helpers ---------------------------------------------------------------

  /** Build stakeholderUids[] from stakeholders[].uid OR by email lookup in /users */
  private async deriveStakeholderUids(p: ReqSpecsProject): Promise<string[]> {
    const out = new Set<string>();

    // Always include the project owner
    if (p.createdBy?.uid) out.add(p.createdBy.uid);

    const list = p.stakeholders ?? [];
    if (!list.length) return Array.from(out);

    // 1) direct UIDs from stakeholders
    for (const s of list) {
      const uid = (s.uid ?? '').trim();
      if (uid) out.add(uid);
    }

    // 2) resolve emails to UIDs from /users collection (if contact looks like an email)
    const emails = Array.from(
      new Set(
        list
          .map(s => (s.contact ?? '').trim().toLowerCase())
          .filter(e => !!e && /\S+@\S+\.\S+/.test(e))
      )
    );

    if (emails.length) {
      const usersRef = collection(this.firestore, 'users');
      // Firestore 'in' supports up to 10 values; chunk if needed
      const chunks: string[][] = [];
      for (let i = 0; i < emails.length; i += 10) chunks.push(emails.slice(i, i + 10));

      for (const chunk of chunks) {
        const snap = await getDocs(query(usersRef, where('email', 'in', chunk)));
        snap.forEach(d => out.add(d.id)); // user doc id == uid
      }
    }

    return Array.from(out);
  }


  /** True if user is the project owner */
  isOwner(p: ReqSpecsProject, user?: AppUser | { uid?: string }): boolean {
    const uid = user?.uid;
    return !!uid && p.createdBy?.uid === uid;
  }

  /** True if user is listed among stakeholders */
  isStakeholder(p: ReqSpecsProject, user?: AppUser | { uid?: string }): boolean {
    const uid = user?.uid;
    if (!uid) return false;
    return !!p.stakeholderUids?.includes(uid) || !!(p.stakeholders || []).some(s => s.uid === uid);
  }

  /** True if user can view the project */
  canView(p: ReqSpecsProject, user?: AppUser): boolean {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (this.isOwner(p, user)) return true;
    if (this.isStakeholder(p, user)) return true;
    return false;
  }

  /** True if user can delete the project */
  canDelete(p: ReqSpecsProject, user?: AppUser): boolean {
    if (!user) return false;
    return user.role === 'admin' || this.isOwner(p, user);
  }
}
