import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { InventarioService } from '../inventario.service';

@Component({
  selector: 'ngx-nuevo-repuesto-modal',
  templateUrl: './nuevo-repuesto-modal.component.html',
  styleUrls: ['./nuevo-repuesto-modal.component.scss'],
})
export class NuevoRepuestoModalComponent {
  constructor(
    protected ref: NbDialogRef<NuevoRepuestoModalComponent>,
    private formBuilder: FormBuilder,
    private service: InventarioService
  ) {}

  nuevoForm: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.maxLength(30), Validators.pattern("[a-zA-Z0-9 ,']*")]],
    costo: ['', [Validators.required, Validators.maxLength(5), Validators.pattern('([0-9]+\.?[0-9]*|\.[0-9]+)')]], // TODO checkear estaa
    stock: ['', [Validators.required, Validators.maxLength(3), Validators.pattern('[0-9]*')]],
  });

  // matcher = new MyErrorStateMatcher();

  dismiss() {
    this.ref.close(false);
  }

  confirm() {
    this.service
      .agregarRepuestoInventario(
        this.nuevoForm.get('nombre').value,
        Number(this.nuevoForm.get('costo').value),
        Number(this.nuevoForm.get('stock').value)
      )
      .then((res) => this.ref.close(true))
      .catch((e) => this.ref.close(false));
  }
}
