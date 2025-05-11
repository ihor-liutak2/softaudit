import { Routes } from '@angular/router';
import { AuditRootComponent } from './audit-root.component';
import { AddProjectComponent } from './audit-add-project.component';
import { AuditHomeComponent } from './audit-home.component';
import { AuditProjectFindingsComponent } from './audit-project-findings.component';

export const auditRoutes: Routes = [
  { 
    path: '', 
    component: AuditRootComponent,
    children: [
      { path: '', component: AuditHomeComponent },
      { path: 'edit/:id', component: AddProjectComponent },
      { path: 'findings/:id', component: AuditProjectFindingsComponent },
      { path: 'report/:id', loadComponent: () => import('./audit-project-report.component').then(m => m.AuditProjectReportComponent) },
      { path: 'add-project', component: AddProjectComponent },
    ]
  }
];