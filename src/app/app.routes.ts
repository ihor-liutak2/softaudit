import { Routes } from '@angular/router';
import { LoginComponent } from './core/user/login.component';
import { RegisterComponent } from './core/user/register.component';
import { ResetPasswordComponent } from './core/user/reset-password.component';
import { UserProfileComponent } from './core/user/user-profile.component';
import { inject } from '@angular/core';
import { UserService } from './core/user/user.service';
import { GeneralComponent } from './core/general/general.component';
import { auditRoutes } from './audit/audit.routes';
import { validationRoutes } from './validation/validation.routes';
import { verificationRoutes } from './verification/verification.routes';
import { adminRoutes } from './admin/admin.routes';

function authGuard() {
  const userService = inject(UserService);
  return !!userService.user;
}

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'profile', component: UserProfileComponent, canActivate: [authGuard] },
  // After login (protected)
  { path: 'home', component: GeneralComponent, canActivate: [authGuard] },
  // Modules
  { path: 'audit', children: auditRoutes, canActivate: [authGuard] },
  { path: 'validation', children: validationRoutes, canActivate: [authGuard] },
  { path: 'verification', children: verificationRoutes, canActivate: [authGuard] },
  { path: 'admin', children: adminRoutes, canActivate: [authGuard] },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];