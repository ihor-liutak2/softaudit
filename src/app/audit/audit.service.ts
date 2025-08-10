import { Injectable, signal } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  getDoc,
  CollectionReference,
  DocumentReference,
  QuerySnapshot,
  DocumentData,
} from '@angular/fire/firestore';

import { VOCABULARY_SECTORS } from '../core/utils/vocabulary';
import { COMPANY_SEEDS } from '../core/utils/companies'; // (залишив як було; якщо не треба — видали)
import {
  Sector,
  Company,
  AuditProject,
  AuditChecklistItem,
  AuditFinding,
  AuditFindingTemplate,
  AuditUserRole,
} from '../core/general/general.types';
import { AUDIT_CHECKLIST } from '../core/utils/audit';
import { AUDIT_FINDING_TEMPLATES } from '../core/utils/audit-finding';

@Injectable({ providedIn: 'root' })
export class AuditService {
  sectors = signal<Sector[]>([]);
  companies = signal<Company[]>([]);
  checklistItems = signal<AuditChecklistItem[]>([]);
  findingTemplates = signal<AuditFindingTemplate[]>([]);
  projects = signal<AuditProject[]>([]);

  constructor(private readonly firestore: Firestore) {
    this.loadSectors();
    this.loadCompanies();
    this.loadChecklistItems();
    this.loadFindingTemplates();
  }

  // ---------------------
  // Static vocab loaders
  // ---------------------

  loadSectors(): void {
    if (this.sectors().length) return;

    const sectors = VOCABULARY_SECTORS.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description || '',
    }));

    this.sectors.set(sectors);
  }

  loadChecklistItems(): void {
    if (this.checklistItems().length) return;
    this.checklistItems.set(AUDIT_CHECKLIST);
  }

  loadFindingTemplates(): void {
    if (this.findingTemplates().length) return;
    this.findingTemplates.set(AUDIT_FINDING_TEMPLATES);
  }

  // ---------------------
  // Companies (Firestore)
  // ---------------------

  async loadCompanies(): Promise<void> {
    if (this.companies().length) return;

    const companiesCol: CollectionReference<DocumentData> = collection(
      this.firestore,
      'companies'
    );
    const snap: QuerySnapshot<DocumentData> = await getDocs(companiesCol);

    const loaded = snap.docs.map((d) => d.data() as Company);
    this.companies.set(loaded);
  }

  // ---------------------
  // AuditProject (CRUD)
  // ---------------------

  async saveAuditProject(project: AuditProject): Promise<string> {
    const projectId = project.id || this.firestoreId();
    const projectRef: DocumentReference<DocumentData> = doc(
      this.firestore,
      'auditProjects',
      projectId
    );
    await setDoc(projectRef, { ...project, id: projectId });
    return projectId;
  }

  private firestoreId(): string {
    // Create a client-side ID by creating a doc ref without writing
    return doc(collection(this.firestore, 'auditProjects')).id;
  }

  async deleteAuditProject(projectId: string): Promise<void> {
    const projectRef = doc(this.firestore, 'auditProjects', projectId);
    await deleteDoc(projectRef);
  }

  async loadAllAuditProjects(): Promise<void> {
    const projectsRef = collection(this.firestore, 'auditProjects');
    const snap = await getDocs(projectsRef);
    const loaded = snap.docs.map((d) => d.data() as AuditProject);
    this.projects.set(loaded);
  }

  async loadAuditProjectsForUser(userEmail: string): Promise<void> {
    const projectsRef = collection(this.firestore, 'auditProjects');
    const q1 = query(projectsRef, where('auditTeam', 'array-contains', userEmail));
    const snap = await getDocs(q1);
    const loaded = snap.docs.map((d) => d.data() as AuditProject);
    this.projects.set(loaded);
  }

  async getAuditProjectById(projectId: string): Promise<AuditProject | undefined> {
    const projectRef = doc(this.firestore, 'auditProjects', projectId);
    const snap = await getDoc(projectRef);
    return snap.exists() ? (snap.data() as AuditProject) : undefined;
  }

  async loadAuditProjectsByUserEmail(userEmail: string, isAdmin: boolean): Promise<void> {
    const projectsRef = collection(this.firestore, 'auditProjects');

    if (isAdmin) {
      const snap = await getDocs(projectsRef);
      const loaded = snap.docs.map((d) => d.data() as AuditProject);
      this.projects.set(loaded);
      return;
    }

    // 1) projects where user in auditTeam
    const q1 = query(projectsRef, where('auditTeam', 'array-contains', userEmail));
    const snap1 = await getDocs(q1);
    const auditTeamProjects = snap1.docs.map((d) => d.data() as AuditProject);

    // 2) all projects to filter by companyRepresentatives/approvers
    const snapAll = await getDocs(projectsRef);
    const allProjects = snapAll.docs.map((d) => d.data() as AuditProject);

    const additionalProjects = allProjects.filter(
      (p) =>
        (p.companyRepresentatives || []).some((rep) => rep.email === userEmail) ||
        (p.approvers || []).some((appr) => appr.email === userEmail)
    );

    const allRelevant = [...auditTeamProjects, ...additionalProjects];
    const unique = Array.from(new Map(allRelevant.map((p) => [p.id, p])).values());

    this.projects.set(unique);
  }

  // ---------------------
  // Checklist items read
  // ---------------------

  async getChecklistItems(projectId: string): Promise<AuditChecklistItem[]> {
    const projectRef = doc(this.firestore, `auditProjects/${projectId}`);
    const snap = await getDoc(projectRef);

    if (!snap.exists()) {
      console.warn(`Project ${projectId} not found`);
      return [];
    }

    const data = snap.data() as Record<string, unknown>;
    return (data['checklistItems'] as AuditChecklistItem[]) || [];
  }

  // ---------------------
  // Findings (subcollection)
  // ---------------------

  async getFindingsForProject(projectId: string): Promise<AuditFinding[]> {
    const findingsRef = collection(this.firestore, `auditFindings/${projectId}/findings`);
    const snap = await getDocs(findingsRef);
    return snap.docs.map((d) => d.data() as AuditFinding);
  }

  async saveFinding(
    finding: AuditFinding,
    currentUser: { userId: string; userName?: string; role: AuditUserRole }
  ): Promise<void> {
    const findingRef = doc(
      this.firestore,
      `auditFindings/${finding.projectId}/findings/${finding.id}`
    );

    const findingToSave: AuditFinding = {
      ...finding,
      lastModifiedBy: {
        userId: currentUser.userId,
        userName: currentUser.userName,
        role: currentUser.role,
        modifiedAt: new Date().toISOString(),
      },
    };

    await setDoc(findingRef, findingToSave);
  }

  async deleteFinding(projectId: string, findingId: string): Promise<void> {
    const findingRef = doc(this.firestore, `auditFindings/${projectId}/findings/${findingId}`);
    await deleteDoc(findingRef);
  }
}
