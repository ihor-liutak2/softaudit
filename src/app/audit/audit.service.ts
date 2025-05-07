import { Injectable, signal } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, deleteDoc, getDocs, query, where, getDoc } from '@angular/fire/firestore';
import { VOCABULARY_SECTORS } from '../core/utils/vocabulary';
import { COMPANY_SEEDS } from '../core/utils/companies';
import { Sector, Company, AuditProject, AuditChecklistItem, AuditFinding } from '../core/general/general.types';
import { AUDIT_CHECKLIST } from '../core/utils/audit';

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  sectors = signal<Sector[]>([]);
  companies = signal<Company[]>([]);
  checklistItems = signal<AuditChecklistItem[]>([]);
  projects = signal<AuditProject[]>([]);


  constructor(private firestore: Firestore) {
    this.loadSectors();
    this.loadCompanies();
    this.loadChecklistItems();
  }

  /**
   * Load sectors from local vocabulary data
   */
  loadSectors(): void {
    if (this.sectors().length) return;

    const sectors = VOCABULARY_SECTORS.map(sector => ({
      id: sector.id,
      name: sector.name,
      description: sector.description || ''
    }));

    this.sectors.set(sectors);
  }

  /**
   * Load companies data from predefined seeds
   */
  loadCompanies(): void {
    if (this.companies().length) return;

    this.companies.set(COMPANY_SEEDS);
  }

  loadChecklistItems(): void {
    if (this.checklistItems().length) return;
    this.checklistItems.set(AUDIT_CHECKLIST);
  }

  // ---------------------
  // AuditProject methods
  // ---------------------

  async saveAuditProject(project: AuditProject): Promise<string> {
    const projectId = project.id || this.firestoreId();
    const projectRef = doc(this.firestore, 'auditProjects', projectId);
  
    await setDoc(projectRef, { ...project, id: projectId });
  
    return projectId;
  }
  
  private firestoreId(): string {
    return doc(collection(this.firestore, 'auditProjects')).id;
  }
  

  async deleteAuditProject(projectId: string): Promise<void> {
    const projectRef = doc(this.firestore, 'auditProjects', projectId);
    await deleteDoc(projectRef);
  }

  async loadAllAuditProjects(): Promise<void> {
    const projectsRef = collection(this.firestore, 'auditProjects');
    const snap = await getDocs(projectsRef);
    const loaded = snap.docs.map(doc => doc.data() as AuditProject);
    this.projects.set(loaded);
  }
  
  async loadAuditProjectsForUser(userEmail: string): Promise<void> {
    const projectsRef = collection(this.firestore, 'auditProjects');
    const q = query(projectsRef, where('auditTeam', 'array-contains', userEmail));
    const snap = await getDocs(q);
    const loaded = snap.docs.map(doc => doc.data() as AuditProject);
    this.projects.set(loaded);
  }

  async getAuditProjectById(projectId: string): Promise<AuditProject | undefined> {
    const projectRef = doc(this.firestore, 'auditProjects', projectId);
    const snap = await getDoc(projectRef);
    return snap.exists() ? snap.data() as AuditProject : undefined;
  }
  

  // -----------------------------
  // AuditChecklistItem methods
  // -----------------------------

  async saveAuditChecklistItem(projectId: string, item: AuditChecklistItem): Promise<void> {
    const itemRef = doc(this.firestore, `auditProjects/${projectId}/checklistItems`, item.id);
    await setDoc(itemRef, item);
  }

  async deleteAuditChecklistItem(projectId: string, itemId: string): Promise<void> {
    const itemRef = doc(this.firestore, `auditProjects/${projectId}/checklistItems`, itemId);
    await deleteDoc(itemRef);
  }

  // --------------------------
  // AuditFinding methods
  // --------------------------

  async saveAuditFinding(projectId: string, finding: AuditFinding): Promise<void> {
    const findingRef = doc(this.firestore, `auditProjects/${projectId}/findings`, finding.id);
    await setDoc(findingRef, finding);
  }

  async deleteAuditFinding(projectId: string, findingId: string): Promise<void> {
    const findingRef = doc(this.firestore, `auditProjects/${projectId}/findings`, findingId);
    await deleteDoc(findingRef);
  }
}
