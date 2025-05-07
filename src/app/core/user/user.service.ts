import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { docData } from 'rxfire/firestore';
import { AppUser } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser?: AppUser;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.loadUser(user.uid);
      } else {
        this.currentUser = undefined;
      }
    });
  }

  async register(email: string, password: string, displayName: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    const user: AppUser = {
      uid: cred.user.uid,
      email,
      displayName,
      role: 'employee'
    };
    await setDoc(doc(this.firestore, 'users', cred.user.uid), user);
    this.currentUser = user;
  }

  async login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    const snap = await getDoc(doc(this.firestore, 'users', cred.user.uid));
    this.currentUser = snap.data() as AppUser;
  }

  logout() {
    this.currentUser = undefined;
    return signOut(this.auth);
  }

  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  async loadUser(uid: string) {
    const snap = await getDoc(doc(this.firestore, 'users', uid));
    this.currentUser = snap.data() as AppUser;
  }

  get user() {
    return this.currentUser;
  }

  get userEmail() {
    return this.currentUser?.email || '';
  }
}
