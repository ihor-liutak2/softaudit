import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private nextId = 0;
  private _toasts = signal<Toast[]>([]);
  toasts = this._toasts.asReadonly();

  show(message: string, type: Toast['type'] = 'info', autoHideMs = 3000) {
    const id = ++this.nextId;
    this._toasts.update((list) => [...list, { id, message, type }]);

    if (autoHideMs > 0) {
      setTimeout(() => this.remove(id), autoHideMs);
    }
  }

  remove(id: number) {
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
