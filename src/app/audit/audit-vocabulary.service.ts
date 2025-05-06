import { Injectable, signal } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, getDocs, query } from '@angular/fire/firestore';
import { VOCABULARY_SECTORS } from '../core/utils/vocabulary';
import { Sector } from '../core/general/general.types';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {

    private sectorsSignal = signal<Sector[]>([]);

  constructor(private firestore: Firestore) {}

   /**
   * Public signal for components
   */
   get sectors() {
    return this.sectorsSignal.asReadonly();
  }

   /**
   * Load sectors from Firestore (if not yet loaded)
   */
   async loadSectors() {
    if (this.sectorsSignal().length) return; // already loaded

    const sectorsRef = collection(this.firestore, 'sectors');
    const snap = await firstValueFrom(collectionData(sectorsRef, { idField: 'id' }));

    const sectors = (snap as any[]).map(data => ({
      id: data.id,
      name: data.name
    })) as Sector[];

    this.sectorsSignal.set(sectors);
  }

  /**
 * Upload initial sectors if not exist
 */
async uploadVocabularySectors() {
    const sectorsRef = collection(this.firestore, 'sectors');
    const existingSnap = await getDocs(sectorsRef);
    const existingSectors = existingSnap.docs.map(doc => doc.id.toLowerCase());
  
    let added = 0, skipped = 0;
  
    for (const sector of VOCABULARY_SECTORS) {
      const sectorId = sector.id;
  
      if (existingSectors.includes(sectorId)) {
        skipped++;
        continue; // Already exists
      }
  
      const docRef = doc(sectorsRef, sectorId);
      const sectorData: Sector = {
        id: sector.id,
        name: sector.name
      };
  
      await setDoc(docRef, sectorData);
      added++;
    }
  
    alert(`Sectors uploaded: ${added}, Skipped (existing): ${skipped}`);
  }
  
}
