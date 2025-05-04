import { Routes } from '@angular/router';
import { LoginComponent } from './core/user/login.component';
import { RegisterComponent } from './core/user/register.component';
import { ResetPasswordComponent } from './core/user/reset-password.component';
import { UserProfileComponent } from './core/user/user-profile.component';
import { inject } from '@angular/core';
import { UserService } from './core/user/user.service';
import { auditRoutes } from './audit/audit.routes';

function authGuard() {
  const userService = inject(UserService);
  return !!userService.user;
}

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'profile', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'audit', children: auditRoutes },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];