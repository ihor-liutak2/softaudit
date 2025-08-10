import { Injectable, OnDestroy } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  Unsubscribe,
  User,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  DocumentReference,
  DocumentSnapshot,
  DocumentData,
} from '@angular/fire/firestore';
import { AppUser } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {
  // In-memory cache of the current app user document
  private currentUser?: AppUser;
  private authUnsub?: Unsubscribe;

  constructor(private auth: Auth, private firestore: Firestore) {
    // Subscribe to Firebase Auth state
    this.authUnsub = this.auth.onAuthStateChanged(async (user: User | null) => {
      if (user?.uid) {
        await this.loadUser(user.uid);
      } else {
        this.currentUser = undefined;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authUnsub) {
      this.authUnsub();
      this.authUnsub = undefined;
    }
  }

  // Create auth user + corresponding Firestore profile
  async register(email: string, password: string, displayName: string): Promise<void> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);

    const userDocRef: DocumentReference<AppUser> = doc(
      this.firestore,
      'users',
      cred.user.uid
    ) as DocumentReference<AppUser>;

    const userDoc: AppUser = {
      uid: cred.user.uid,
      email,
      displayName,
      role: 'employee',
    };

    await setDoc(userDocRef, userDoc);
    this.currentUser = userDoc;
  }

  // Sign in and load profile from Firestore
  // async login(email: string, password: string): Promise<void> {
  //   const cred = await signInWithEmailAndPassword(this.auth, email, password);

  //   const userDocRef: DocumentReference<AppUser> = doc(
  //     this.firestore,
  //     'users',
  //     cred.user.uid
  //   ) as DocumentReference<AppUser>;

  //   const snap: DocumentSnapshot<AppUser> = await getDoc(userDocRef);

  //   this.currentUser = snap.exists() ? (snap.data() as AppUser) : undefined;
  // }


// inside UserService

private maskEmail(email: string): string {
  const [user, domain] = (email || '').split('@');
  if (!user || !domain) return '(invalid email)';
  if (user.length <= 2) return `${'*'.repeat(user.length)}@${domain}`;
  return `${user[0]}${'*'.repeat(Math.max(1, user.length - 2))}${user[user.length - 1]}@${domain}`;
}

async login(email: string, password: string): Promise<void> {
  const t0 = performance.now();
  console.groupCollapsed('%c[UserService] login()', 'color:#0aa; font-weight:bold;');
  console.debug('Input', { email: this.maskEmail(email), hasPassword: !!password });

  try {
    console.time('[UserService] signInWithEmailAndPassword');
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    console.timeEnd('[UserService] signInWithEmailAndPassword');

    console.info('Auth OK', {
      uid: cred.user?.uid,
      email: cred.user?.email,
      providers: cred.user?.providerData?.map(p => p.providerId),
    });

    // quick sanity info about the Firestore instance
    console.debug('[UserService] Firestore instance', {
      hasApp: !!(this.firestore as any)?.app,
      ctor: (this.firestore as any)?.constructor?.name,
    });

    // use single-path overload to avoid any collection(...) mismatch
    const userDocRef = doc(this.firestore, `users/${cred.user.uid}`);

    console.time('[UserService] getDoc(users/{uid})');
    const snap = await getDoc(userDocRef);
    console.timeEnd('[UserService] getDoc(users/{uid})');

    if (snap.exists()) {
      this.currentUser = snap.data() as AppUser;
      console.debug('Profile loaded', {
        uid: this.currentUser.uid,
        role: this.currentUser.role,
      });
    } else {
      this.currentUser = undefined;
      console.warn('Profile document not found for uid:', cred.user.uid);
    }
  } catch (err: any) {
    console.error('[UserService] login failed', {
      message: err?.message ?? String(err),
      code: err?.code,
      stack: err?.stack,
    });
    throw err; // let caller show toast
  } finally {
    const ms = Math.round(performance.now() - t0);
    console.debug('Total duration (ms)', ms);
    console.groupEnd();
  }
}




  // Sign out and clear cache
  async logout(): Promise<void> {
    this.currentUser = undefined;
    await signOut(this.auth);
  }

  // Send password reset email
  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  // Load profile by uid
  async loadUser(uid: string): Promise<void> {
    const userDocRef: DocumentReference<AppUser> = doc(
      this.firestore,
      'users',
      uid
    ) as DocumentReference<AppUser>;

    const snap: DocumentSnapshot<AppUser> = await getDoc(userDocRef);
    this.currentUser = snap.exists() ? (snap.data() as AppUser) : undefined;
  }

  // Getters (no side effects)
  get user(): AppUser | undefined {
    return this.currentUser;
  }

  get userEmail(): string {
    return this.currentUser?.email ?? '';
  }
}
