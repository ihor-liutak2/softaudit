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
} from '@angular/fire/firestore';
import { ReqSpecsProject } from './req-specs.types';
import { Company } from '../core/general/general.types';
import { VOCABULARY_SECTORS } from '../core/utils/vocabulary';
import { COLL_REQSPECS_PROJECTS, COLL_COMPANIES } from './req-specs.collections';

@Injectable({ providedIn: 'root' })
export class ReqSpecsService {
  private readonly firestore = inject(Firestore);

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
  async loadAllProjects(): Promise<void> {
    const snap = await getDocs(this.projectsCol);
    this.projects.set(snap.docs.map(d => d.data() as ReqSpecsProject));
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
  async saveProject(project: ReqSpecsProject): Promise<string> {
    const id = project.id ?? doc(this.projectsCol).id; // safer id generation
    const ref = doc(this.projectsCol, id);

    const existed = (await getDoc(ref)).exists();

    const payload: ReqSpecsProject = this.cleanProject({
      ...project,
      id,
      status: project.status ?? 'draft',
      createdAt: existed ? project.createdAt : project.createdAt ?? this.now(),
      updatedAt: this.now(),
    });

    await setDoc(ref, payload, { merge: true });

    // Update local cache
    const all = this.projects().filter(p => p.id !== id);
    this.projects.set([...all, payload]);

    return id;
  }

  /** Deletes a project and updates local signal state */
  async deleteProject(projectId: string): Promise<void> {
    await deleteDoc(doc(this.projectsCol, projectId));
    this.projects.set(this.projects().filter(p => p.id !== projectId));
  }

  /** Lazy-loads companies list (used for project/company pickers) */
  async loadCompanies(): Promise<void> {
    if (this.companies().length) return;
    const snap = await getDocs(this.companiesCol);
    this.companies.set(snap.docs.map(d => d.data() as Company));
  }
}
