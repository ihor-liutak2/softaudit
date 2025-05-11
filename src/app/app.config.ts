import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { getApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// Use the Firebase app initialized in main.ts (getApp() retrieves the singleton instance)
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => getApp()),     // use existing app instance
    provideAuth(() => getAuth()),           // auth bound to the app
    provideFirestore(() => getFirestore())  // firestore bound to the app
  ]
};
