import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  getDocs,
  query,
  where
} from '@angular/fire/firestore';
import { StoredAuditReport } from '../core/general/general.types';


@Injectable({ providedIn: 'root' })
export class AuditReportService {
  constructor(private firestore: Firestore) {}

  private collectionPath = 'auditReports';

  async createReport(report: StoredAuditReport): Promise<void> {
    const ref = doc(this.firestore, this.collectionPath, report.id);
    await setDoc(ref, report);
  }

  async updateReport(report: StoredAuditReport): Promise<void> {
    const ref = doc(this.firestore, this.collectionPath, report.id);
    await setDoc(ref, report, { merge: true });
  }

  async getReportById(reportId: string): Promise<StoredAuditReport | undefined> {
    const ref = doc(this.firestore, this.collectionPath, reportId);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as StoredAuditReport) : undefined;
  }

  async getReportByProjectId(projectId: string): Promise<StoredAuditReport | undefined> {
    const reportsRef = collection(this.firestore, this.collectionPath);
    const q = query(reportsRef, where('projectId', '==', projectId));
    const snap = await getDocs(q);
    const docSnap = snap.docs[0];
    return docSnap ? (docSnap.data() as StoredAuditReport) : undefined;
  }

  async deleteReport(reportId: string): Promise<void> {
    const ref = doc(this.firestore, this.collectionPath, reportId);
    await deleteDoc(ref);
  }

  async getReportsByStatus(status: 'draft' | 'submitted' | 'approved'): Promise<StoredAuditReport[]> {
    const reportsRef = collection(this.firestore, this.collectionPath);
    const q = query(reportsRef, where('status', '==', status));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as StoredAuditReport);
  }
}
