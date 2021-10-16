import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { InventarioService } from '../inventario.service';

@Component({
  selector: 'ngx-detalle-repuesto-modal',
  templateUrl: './detalle-repuesto-modal.component.html',
  styleUrls: ['./detalle-repuesto-modal.component.scss'],
})
export class DetalleRepuestoModalComponent {
  constructor(
    protected ref: NbDialogRef<DetalleRepuestoModalComponent>,
    private formBuilder: FormBuilder,
    private service: InventarioService
  ) {}

  listaIngresos = [
   {}
  ];

  dismiss() {
    this.ref.close(false);
  }

}
