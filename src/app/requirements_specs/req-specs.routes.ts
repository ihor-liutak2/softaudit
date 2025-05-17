import { Routes } from '@angular/router';
import { inject } from '@angular/core';

import { ReqSpecsRootComponent } from './req-specs-root.component';
import { ReqSpecsHomeComponent } from './req-specs-home.component';
import { ReqSpecsAddProjectComponent } from './req-specs-add-project.component';
import { ReqSpecsProjectDetailComponent } from './req-specs-project-detail.component';

import { UserService } from '../core/user/user.service';

// Guard for authenticated users
function authGuard() {
  const userService = inject(UserService);
  return !!userService.user;
}

export const reqSpecsRoutes: Routes = [
  {
    path: '',
    component: ReqSpecsRootComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: ReqSpecsHomeComponent,
        title: 'Requirements & Specs – Home'
      },
      {
        path: 'add-project',
        component: ReqSpecsAddProjectComponent,
        title: 'Add Requirements Project'
      },
      {
        path: 'edit/:id',
        component: ReqSpecsAddProjectComponent,
        title: 'Edit Requirements Project'
      },
      {
        path: 'project/:id',
        component: ReqSpecsProjectDetailComponent,
        title: 'Project Details'
      }
    ]
  }
];
