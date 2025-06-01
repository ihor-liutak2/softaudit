import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastMessageComponent } from './core/ui/toast-message.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastMessageComponent],
  template: `
  <app-toast-message></app-toast-message>

    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'audit-app';
}
