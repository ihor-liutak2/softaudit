import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { UserService } from './user.service';
import { ToastMessageComponent } from '../ui/toast-message.component';
import { ToastService } from '../ui/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ToastMessageComponent],
  template: `
   <app-toast-message #toaster position="bottom-right"></app-toast-message>

    <div class="container d-flex align-items-center justify-content-center min-vh-100">
      <div class="card p-4" style="width: 100%; max-width: 400px;">
        
        <img src="/assets/logos/softassure.png" class="mb-4 mx-auto d-block" style="max-height: 80px;" alt="SoftAssure">

        <h3>Login</h3>

        <input class="form-control mb-2" [(ngModel)]="email" placeholder="Email">

        <div class="input-group mb-2">
          <input [type]="showPassword ? 'text' : 'password'" class="form-control" [(ngModel)]="password" placeholder="Password">
          <button type="button" class="btn btn-outline-secondary" (click)="showPassword = !showPassword">
            <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
          </button>
        </div>

        <button class="btn btn-primary w-100" (click)="login()">Login</button>

        <a routerLink="/reset-password" class="d-block mt-2">Forgot password?</a>
        <a routerLink="/register" class="d-block mt-2">Register</a>

      </div>
    </div>
  `
})
export class LoginComponent {
  private toastService = inject(ToastService);
  private userService = inject(UserService);
  private router = inject(Router);

  email = '';
  password = '';
  showPassword = false;

  async login() {
    if (!this.email || !this.password) {
      this.toastService.show('Please enter email and password', 'warning');
      return;
    }

    try {
      await this.userService.login(this.email, this.password);
      this.toastService.show('Login successful!', 'success');
      this.router.navigate(['/home']);
    } catch (err: any) {
      this.toastService.show('Login failed: ' + err.message, 'danger');
    }
  }
}

