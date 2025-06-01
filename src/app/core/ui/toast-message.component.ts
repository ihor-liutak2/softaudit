import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed" [ngClass]="positionClass" style="z-index: 1050;">
      <div
        *ngFor="let toast of toasts()"
        class="toast align-items-center text-white border-0 show mb-2"
        [ngClass]="'bg-' + toast.type"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body">{{ toast.message }}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" (click)="toastService.remove(toast.id)"></button>
        </div>
      </div>
    </div>
  `,
})
export class ToastMessageComponent {
  toastService = inject(ToastService);
  toasts = computed(() => this.toastService.toasts());

  positionClass = 'bottom-0 end-0 p-3'; // can be made @Input() if needed
}
