import { Routes } from '@angular/router';
import { ValidationRootComponent } from './validation-root.component';
import { ValidationHomeComponent } from './validation-home.component';

export const validationRoutes: Routes = [
  {
    path: '',
    component: ValidationRootComponent,
    children: [
      {
        path: '',
        component: ValidationHomeComponent,
        title: 'Validation Home'
      },
      {
        path: 'project/:id',
        loadComponent: () => import('./validation-project.component').then(m => m.ValidationProjectComponent),
        title: 'Validation Project'
      }
    ]
  }
];
