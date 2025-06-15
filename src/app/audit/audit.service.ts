import { Injectable, signal } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, deleteDoc, getDocs, query, where, getDoc } from '@angular/fire/firestore';
import { VOCABULARY_SECTORS } from '../core/utils/vocabulary';
import { COMPANY_SEEDS } from '../core/utils/companies';
import { Sector, Company, AuditProject, AuditChecklistItem, AuditFinding, AuditFindingTemplate, AuditUserRole } from '../core/general/general.types';
import { AUDIT_CHECKLIST } from '../core/utils/audit';
import { AUDIT_FINDING_TEMPLATES } from '../core/utils/audit-finding';

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  sectors = signal<Sector[]>([]);
  companies = signal<Company[]>([]);
  checklistItems = signal<AuditChecklistItem[]>([]);
  findingTemplates = signal<AuditFindingTemplate[]>([]);
  projects = signal<AuditProject[]>([]);


  constructor(private firestore: Firestore) {
    this.loadSectors();
    this.loadCompanies();
    this.loadChecklistItems();
    this.loadFindingTemplates();
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
   * Load companies data from firebase
   */

async loadCompanies(): Promise<void> {
  if (this.companies().length) return;

  const snap = await getDocs(collection(this.firestore, 'companies'));
  const loaded = snap.docs.map(doc => doc.data() as Company);
  this.companies.set(loaded);
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

  async loadAuditProjectsByUserEmail(userEmail: string, isAdmin: boolean): Promise<void> {
  const projectsRef = collection(this.firestore, 'auditProjects');

  if (isAdmin) {
    // Admin sees all projects
    const snap = await getDocs(projectsRef);
    const loaded = snap.docs.map(doc => doc.data() as AuditProject);
    this.projects.set(loaded);
    return;
  }

  // Step 1: get projects where user is in auditTeam
  const q1 = query(projectsRef, where('auditTeam', 'array-contains', userEmail));
  const snap1 = await getDocs(q1);
  const auditTeamProjects = snap1.docs.map(doc => doc.data() as AuditProject);

  // Step 2: get ALL projects to manually filter companyRepresentatives and approvers by email
  const snapAll = await getDocs(projectsRef);
  const allProjects = snapAll.docs.map(doc => doc.data() as AuditProject);

  const additionalProjects = allProjects.filter(project =>
    (project.companyRepresentatives || []).some(rep => rep.email === userEmail) ||
    (project.approvers || []).some(appr => appr.email === userEmail)
  );

  // Merge both lists and remove duplicates
  const allRelevant = [...auditTeamProjects, ...additionalProjects];
  const uniqueProjects = Array.from(new Map(allRelevant.map(p => [p.id, p])).values());

  this.projects.set(uniqueProjects);
}
  

  // -----------------------------
  // AuditChecklistItem methods
  // -----------------------------


  async getChecklistItems(projectId: string): Promise<AuditChecklistItem[]> {
    const projectRef = doc(this.firestore, `auditProjects/${projectId}`);
    const projectSnap = await getDoc(projectRef);
  
    if (!projectSnap.exists()) {
      console.warn(`Project ${projectId} not found`);
      return [];
    }
  
    const data = projectSnap.data();
    return data['checklistItems'] || [];
  }
  
  

  // --------------------------
  // AuditFinding methods
  // --------------------------

 async getFindingsForProject(projectId: string): Promise<AuditFinding[]> {
  const findingsRef = collection(this.firestore, `auditFindings/${projectId}/findings`);
  const snap = await getDocs(findingsRef);

  return snap.docs.map(doc => doc.data() as AuditFinding);
}

  
async saveFinding(
  finding: AuditFinding,
  currentUser: { userId: string; userName?: string; role: AuditUserRole }
): Promise<void> {
  const findingRef = doc(this.firestore, `auditFindings/${finding.projectId}/findings/${finding.id}`);

  const findingToSave = {
    ...finding,
    lastModifiedBy: {
      userId: currentUser.userId,
      userName: currentUser.userName,
      role: currentUser.role,
      modifiedAt: new Date().toISOString()
    }
  };

  await setDoc(findingRef, findingToSave);
}


  async deleteFinding(projectId: string, findingId: string): Promise<void> {
  const findingRef = doc(this.firestore, `auditFindings/${projectId}/findings/${findingId}`);
  await deleteDoc(findingRef);
}

  
}
