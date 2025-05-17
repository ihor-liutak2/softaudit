import { Injectable, signal } from '@angular/core';
import { collection, deleteDoc, doc, Firestore, getDoc, getDocs, setDoc } from '@angular/fire/firestore';
import { ReqSpecsProject } from './req-specs.types';
import { Company, Sector } from '../core/general/general.types';
import { VOCABULARY_SECTORS } from '../core/utils/vocabulary';

@Injectable({
  providedIn: 'root'
})
export class ReqSpecsService {

  // Signals to store state
  sectors = signal<Sector[]>([]);
  projects = signal<ReqSpecsProject[]>([]);
  companies = signal<Company[]>([]);

  constructor(private firestore: Firestore) {
    this.loadSectors();
    this.loadCompanies();
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

async loadAllProjects(): Promise<void> {
  const projectsRef = collection(this.firestore, 'reqSpecsProjects');
  const snap = await getDocs(projectsRef);
  const loadedProjects = snap.docs.map(doc => doc.data() as ReqSpecsProject);
  this.projects.set(loadedProjects);
}

async saveProject(project: ReqSpecsProject): Promise<void> {
  const projectId = project.id || doc(collection(this.firestore, 'reqSpecsProjects')).id;
  const projectRef = doc(this.firestore, 'reqSpecsProjects', projectId);

  const dataToSave: ReqSpecsProject = {
    ...project,
    id: projectId,
    updatedAt: new Date().toISOString()
  };

  await setDoc(projectRef, dataToSave, { merge: true });

  // Optionally update local signal
  const updatedList = this.projects().filter(p => p.id !== projectId);
  this.projects.set([...updatedList, dataToSave]);
}

async deleteProject(projectId: string): Promise<void> {
  const projectRef = doc(this.firestore, 'reqSpecsProjects', projectId);
  await deleteDoc(projectRef);

  // Update local signal after deletion
  const updated = this.projects().filter(p => p.id !== projectId);
  this.projects.set(updated);
}


    /**
   * Load companies from Firestore into signal
   */
  async loadCompanies(): Promise<void> {
    if (this.companies().length > 0) return; // Prevent reload if already loaded

    const companiesRef = collection(this.firestore, 'companies');
    const snapshot = await getDocs(companiesRef);
    const loadedCompanies = snapshot.docs.map(doc => doc.data() as Company);

    this.companies.set(loadedCompanies);
  }

   async getProjectById(projectId: string): Promise<ReqSpecsProject | undefined> {
    const ref = doc(this.firestore, 'reqSpecsProjects', projectId);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as ReqSpecsProject) : undefined;
  }
  
}
