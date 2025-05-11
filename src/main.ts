import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import { initializeApp } from 'firebase/app';
import { environment } from './app/environment';


// Initialize Firebase before bootstrapping Angular
const firebaseApp = initializeApp(environment.firebase);

// Bootstrap Angular application
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
