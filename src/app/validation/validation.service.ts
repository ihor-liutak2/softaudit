import { Injectable, signal } from '@angular/core';
import {
    Firestore,
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    CollectionReference
} from '@angular/fire/firestore';
import { ValidationItem, ValidationProject } from './validation.types';

@Injectable({ providedIn: 'root' })
export class ValidationService {
    projects = signal<ValidationProject[]>([]);
    items = signal<ValidationItem[]>([]);

    constructor(private firestore: Firestore) { }

    private get projectsCollection(): CollectionReference {
        return collection(this.firestore, 'validationProjects');
    }

    private get itemsCollection(): CollectionReference {
        return collection(this.firestore, 'validationItems');
    }

    // Load all validation projects
    async loadProjects(): Promise<void> {
        const snap = await getDocs(this.projectsCollection);
        const loaded = snap.docs.map(d => d.data() as ValidationProject);
        this.projects.set(loaded);
    }

    // Load all validation items
    async loadItems(): Promise<void> {
        const snap = await getDocs(this.itemsCollection);
        const loaded = snap.docs.map(d => d.data() as ValidationItem);
        this.items.set(loaded);
    }

    // Get a project by ID
    async getProjectById(id: string): Promise<ValidationProject | undefined> {
        const ref = doc(this.projectsCollection, id);
        const snap = await getDoc(ref);
        return snap.exists() ? (snap.data() as ValidationProject) : undefined;
    }

    // Get items for a specific project
    async getItemsByProjectId(projectId: string): Promise<ValidationItem[]> {
        const snap = await getDocs(this.itemsCollection);
        return snap.docs
            .map(d => d.data() as ValidationItem)
            .filter(item => item.projectId === projectId);
    }

    // Save or update a validation project
    async saveProject(project: ValidationProject): Promise<void> {
        const id = project.id;
        const ref = doc(this.projectsCollection, id);
        const data = { ...project, updatedAt: new Date().toISOString() };
        await setDoc(ref, data, { merge: true });

        // Update signal
        const all = this.projects().filter(p => p.id !== id);
        this.projects.set([...all, data]);
    }

    // Save or update a validation item
    async saveItem(item: ValidationItem): Promise<void> {
        const id = item.id;
        const ref = doc(this.itemsCollection, id);
        const data = { ...item, updatedAt: new Date().toISOString() };
        await setDoc(ref, data, { merge: true });

        // Update signal
        const all = this.items().filter(i => i.id !== id);
        this.items.set([...all, data]);
    }

    // Delete a validation project
    async deleteProject(id: string): Promise<void> {
        await deleteDoc(doc(this.projectsCollection, id));
        this.projects.set(this.projects().filter(p => p.id !== id));
    }

    // Delete a validation item
    async deleteItem(id: string): Promise<void> {
        await deleteDoc(doc(this.itemsCollection, id));
        this.items.set(this.items().filter(i => i.id !== id));
    }
}
