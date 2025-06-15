import {
  Injectable,
  ApplicationRef,
  ComponentFactoryResolver,
  Injector,
  createComponent
} from '@angular/core';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private cfr: ComponentFactoryResolver
  ) {}

  confirm(options: {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    headerClass?: string;
    confirmButtonClass?: string;
    size?: 'modal-sm' | 'modal-lg' | 'modal-xl';
  }): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const componentRef = createComponent(ConfirmDialogComponent, {
        environmentInjector: this.appRef.injector
      });

      const instance = componentRef.instance;
      instance.dialogId = 'confirmModal-' + Date.now();
      instance.title = options.title || 'Confirm';
      instance.message = options.message || 'Are you sure?';
      instance.confirmText = options.confirmText || 'OK';
      instance.cancelText = options.cancelText || 'Cancel';
      instance.headerClass = options.headerClass || 'bg-primary text-white';
      instance.confirmButtonClass = options.confirmButtonClass || 'btn-danger';
      instance.size = options.size || 'modal-sm';

      instance.confirm.subscribe(() => {
        resolve(true);
        this.cleanup(componentRef);
      });

      instance.cancel.subscribe(() => {
        resolve(false);
        this.cleanup(componentRef);
      });

      document.body.appendChild(componentRef.location.nativeElement);
      this.appRef.attachView(componentRef.hostView);

      setTimeout(() => {
        const modal = new (window as any).bootstrap.Modal(
          document.getElementById(instance.dialogId)!
        );
        modal.show();
      });
    });
  }

  private cleanup(componentRef: any) {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}
