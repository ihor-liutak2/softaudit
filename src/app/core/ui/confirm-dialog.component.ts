// confirm-dialog.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const bootstrap: any;

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal fade" tabindex="-1" [id]="dialogId" aria-hidden="true">
      <div class="modal-dialog" [ngClass]="size">
        <div class="modal-content">
          <div class="modal-header" [ngClass]="headerClass">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p [innerHTML]="message"></p>
          </div>
          <div class="modal-footer">
            <button *ngIf="cancelText" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              {{ cancelText }}
            </button>
            <button *ngIf="confirmText" type="button" class="btn" [ngClass]="confirmButtonClass" (click)="onConfirm()">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  @Input() dialogId = 'confirmModal';
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';
  @Input() size: 'modal-sm' | 'modal-lg' | 'modal-xl' = 'modal-sm';
  @Input() headerClass = 'bg-primary text-white';
  @Input() confirmButtonClass = 'btn-danger';
  @Input() confirmText = 'OK';
  @Input() cancelText = 'Cancel';
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
    const modal = bootstrap.Modal.getInstance(document.getElementById(this.dialogId)!);
    modal?.hide();
  }

  onCancel() {
  this.cancel.emit();
  const modal = (window as any).bootstrap.Modal.getInstance(
    document.getElementById(this.dialogId)!
  );
  modal?.hide();
}
}
