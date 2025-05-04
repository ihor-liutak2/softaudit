import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container d-flex align-items-center justify-content-center min-vh-100">
      <div class="w-100" style="max-width: 300px;">

        <h3 class="text-center mb-4">SoftAssure</h3>

        <button class="btn btn-primary w-100 mb-3" routerLink="/audit">Audit Module</button>
        <button class="btn btn-secondary w-100 mb-3" routerLink="/validation">Validation Module</button>
        <button class="btn btn-info w-100 mb-3" routerLink="/verification">Verification Module</button>

        <button *ngIf="isAdmin" class="btn btn-danger w-100 mb-3" routerLink="/admin">Admin Module</button>

      </div>
    </div>
  `
})
export class GeneralComponent {
  private userService = inject(UserService);

  get isAdmin(): boolean {
    return this.userService.user?.role === 'admin';
  }
}
