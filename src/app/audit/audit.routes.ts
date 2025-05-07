import { Routes } from '@angular/router';
import { AuditRootComponent } from './audit-root.component';
import { AddProjectComponent } from './audit-add-project.component';
import { AuditHomeComponent } from './audit-home.component';

export const auditRoutes: Routes = [
  { 
    path: '', 
    component: AuditRootComponent,
    children: [
      { path: '', component: AuditHomeComponent },
      {
        path: 'edit/:id',
        component: AddProjectComponent
      },  
      { path: 'add-project', component: AddProjectComponent },
    ]
  }
];