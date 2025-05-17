import { Routes } from '@angular/router';
import { AdminMenuComponent } from './admin-menu.component';
import { AdminHomeComponent } from './admin-home.component';
import { AdminUsersComponent } from './admin-users.component';
import { AdminCompaniesComponent } from './admin-companies.component';

export const adminRoutes: Routes = [
  { 
    path: '', 
    component: AdminMenuComponent,
    children: [
      { path: '', component: AdminHomeComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'companies', component: AdminCompaniesComponent },
    ]
  }
];
