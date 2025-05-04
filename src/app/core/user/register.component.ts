import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container d-flex align-items-center justify-content-center min-vh-100">
      <div class="card p-4" style="width: 100%; max-width: 400px;">

        <img src="/assets/logos/softassure.png" class="mb-4 mx-auto d-block" style="max-height: 80px;" alt="SoftAssure">

        <h3>Register</h3>

        <input class="form-control mb-2" [(ngModel)]="email" placeholder="Email">

        <div class="input-group mb-2">
          <input [type]="showPassword ? 'text' : 'password'" class="form-control" [(ngModel)]="password" placeholder="Password">
          <button type="button" class="btn btn-outline-secondary" (click)="showPassword = !showPassword">
            <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
          </button>
        </div>

        @if (password && !isPasswordValid()) {
          <small class="text-danger">
            Password must be at least 8 characters long and include uppercase, lowercase letters and numbers.
          </small>
        }

        <div class="input-group mb-2">
          <input [type]="showPassword ? 'text' : 'password'" class="form-control" [(ngModel)]="repeatPassword" placeholder="Repeat Password">
        </div>

        @if (password !== repeatPassword && repeatPassword) {
          <small class="text-danger">
            Passwords do not match
          </small>
        }

        <input class="form-control mb-2" [(ngModel)]="displayName" placeholder="Display Name">

        <button class="btn btn-success w-100"
          [disabled]="!isPasswordValid() || password !== repeatPassword || !password"
          (click)="register()">Register</button>

        <a routerLink="/login" class="d-block mt-3">Back to login</a>

      </div>
    </div>
  `
})
export class RegisterComponent {
  email = '';
  password = '';
  repeatPassword = '';
  displayName = '';
  showPassword = false;

  private userService = inject(UserService);

  async register() {
    if (!this.isPasswordValid() || this.password !== this.repeatPassword) return;

    try {
      await this.userService.register(this.email, this.password, this.displayName);
      alert("Registration successful!");
    } catch (err: any) {
      alert("Registration error: " + err.message);
    }
  }

  isPasswordValid(): boolean {
    const minLength = this.password.length >= 8;
    const hasUpper = /[A-Z]/.test(this.password);
    const hasLower = /[a-z]/.test(this.password);
    const hasNumber = /[0-9]/.test(this.password);

    return minLength && hasUpper && hasLower && hasNumber;
  }
}
