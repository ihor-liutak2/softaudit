import { Component } from '@angular/core';
import { UserService } from './user.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <div class="container d-flex align-items-center justify-content-center min-vh-100">
      <div class="card p-4" style="width: 100%; max-width: 400px;">
        <h3>Reset Password</h3>
        <input class="form-control mb-2" [(ngModel)]="email" placeholder="Email">
        <button class="btn btn-warning w-100" (click)="reset()">Send Reset Email</button>
        <a routerLink="/login" class="d-block mt-2">Back to login</a>
      </div>
    </div>
  `
})
export class ResetPasswordComponent {
  email = '';

  constructor(private userService: UserService) {}

  reset() {
    this.userService.resetPassword(this.email);
  }
}
