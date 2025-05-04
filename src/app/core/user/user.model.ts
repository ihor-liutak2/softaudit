export interface AppUser {
    uid: string;
    email: string;
    displayName?: string;
    role: 'admin' | 'employee';
    companyId?: string;
  }
  