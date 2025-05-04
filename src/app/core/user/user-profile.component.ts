import { Component } from '@angular/core';
import { UserService } from './user.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <div class="container d-flex align-items-center justify-content-center min-vh-100">
      <div class="card p-4" style="width: 100%; max-width: 400px;">
        <h3>User Profile</h3>
        <p><strong>Email:</strong> {{userService.user?.email}}</p>
        <p><strong>Role:</strong> {{userService.user?.role}}</p>
        <p><strong>Display Name:</strong> {{userService.user?.displayName}}</p>
        <button class="btn btn-danger w-100" (click)="logout()">Logout</button>
      </div>
    </div>
  `
})
export class UserProfileComponent {

  constructor(public userService: UserService) {}

  logout() {
    this.userService.logout();
  }
}
