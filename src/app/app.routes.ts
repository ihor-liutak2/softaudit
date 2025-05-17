import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from './core/user/user.service';

import { LoginComponent } from './core/user/login.component';
import { RegisterComponent } from './core/user/register.component';
import { ResetPasswordComponent } from './core/user/reset-password.component';
import { UserProfileComponent } from './core/user/user-profile.component';
import { GeneralComponent } from './core/general/general.component';

import { auditRoutes } from './audit/audit.routes';
import { validationRoutes } from './validation/validation.routes';
import { verificationRoutes } from './verification/verification.routes';
import { adminRoutes } from './admin/admin.routes';

import { StaticPageComponent } from './app-static-page';
import { reqSpecsRoutes } from './requirements_specs/req-specs.routes';

function authGuard() {
  const userService = inject(UserService);
  return !!userService.user;
}

export const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // User profile
  { path: 'profile', component: UserProfileComponent, canActivate: [authGuard] },

  // General (after login)
  { path: 'home', component: GeneralComponent, canActivate: [authGuard] },

  // Modules (protected)
  { path: 'audit', children: auditRoutes, canActivate: [authGuard] },
  { path: 'validation', children: validationRoutes, canActivate: [authGuard] },
  { path: 'verification', children: verificationRoutes, canActivate: [authGuard] },
  { path: 'req-specs', children: reqSpecsRoutes, canActivate: [authGuard] },
  { path: 'admin', children: adminRoutes, canActivate: [authGuard] },

   // Static pages (public)
  { path: '', redirectTo: 'page/home', pathMatch: 'full' },
  { path: 'page/:page', component: StaticPageComponent },

  // Fallback
  { path: '**', redirectTo: 'page/home' }
];