import { ApplicationConfig, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideFirebaseApp, FirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';

import { initializeApp } from 'firebase/app';
import { initializeAuth, browserLocalPersistence } from 'firebase/auth';

// use Firestore from the Firebase SDK to register the component
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  // experimentalForceLongPolling // <- uncomment if needed behind proxies
} from 'firebase/firestore';

import { environment } from './environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // 1) Create the [DEFAULT] app
    provideFirebaseApp(() => initializeApp(environment.firebase)),

    // 2) Explicitly register Auth for this app
    provideAuth(() => {
      const app = inject(FirebaseApp);
      return initializeAuth(app, {
        persistence: browserLocalPersistence,
      });
    }),

    // 3) Explicitly register Firestore for this app
    provideFirestore(() => {
      const app = inject(FirebaseApp);
      return initializeFirestore(app, {
        // Reliable local cache across tabs; safe defaults
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
        // experimentalForceLongPolling: true, // <- enable if you still get network issues in dev
      });
    }),
  ],
};
