import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-confirmation-modal',
  templateUrl: 'confirmation-modal.component.html',
  styleUrls: ['confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent {

  @Input() title: string;
  @Input() body: string;
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() status = 'primary';
  @Input() icon = 'exclamation-triangle';

  constructor(protected ref: NbDialogRef<ConfirmationModalComponent>) {}

  dismiss() {
    this.ref.close(false);
  }

  confirm() {
    this.ref.close(true);
  }
}
