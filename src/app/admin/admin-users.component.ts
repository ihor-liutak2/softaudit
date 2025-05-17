import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';

type AppUser = {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'employee';
};

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <h2>User Management</h2>
      <p class="text-muted">Manage users and their global roles</p>

      <table class="table table-bordered mt-4">
        <thead class="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          @for (user of users(); track user.uid) {
            <tr>
              <td>{{ user.displayName || '-' }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="badge"
                      [ngClass]="{
                        'bg-primary': user.role === 'admin',
                        'bg-secondary': user.role === 'employee'
                      }">
                  {{ user.role }}
                </span>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  users = signal<AppUser[]>([]);

  constructor(private firestore: Firestore) {}

  async ngOnInit() {
    const snap = await getDocs(collection(this.firestore, 'users'));
    const loaded = snap.docs.map(doc => doc.data() as AppUser);
    this.users.set(loaded);
  }
}
