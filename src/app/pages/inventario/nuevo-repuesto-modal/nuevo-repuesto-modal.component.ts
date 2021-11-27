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

  modoEdicion = false;
  repuesto: any;
  loading = false;
  nuevoForm: FormGroup = this.formBuilder.group({
    nombre: [
      '',
      [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern("[a-zA-Z0-9 ,']*"),
      ],
    ],
    costo: ['', [Validators.required, Validators.maxLength(10)]],
    stock: ['', [Validators.required, Validators.maxLength(3)]],
  });

  ngOnInit() {
    if (this.modoEdicion) {
      this.nuevoForm.patchValue({
        nombre: this.repuesto.get('nombre'),
        costo: this.repuesto.get('costo'),
        stock: this.repuesto.get('stock'),
      });
    }
  }

  dismiss() {
    this.ref.close(false);
  }

  confirm() {
    if (!this.loading) {
      this.loading = true;
      if (this.modoEdicion) {
        this.service
          .editarRepuestoInventario(
            this.repuesto.id,
            this.nuevoForm.get('nombre').value,
            Number(this.nuevoForm.get('costo').value),
            this.repuesto.get('stock')
          )
          .then((res) => this.ref.close(res))
          .catch((e) => this.ref.close(false))
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.service
          .agregarRepuestoInventario(
            this.nuevoForm.get('nombre').value,
            Number(this.nuevoForm.get('costo').value),
            Number(this.nuevoForm.get('stock').value)
          )
          .then((res) => this.ref.close(true))
          .catch((e) => this.ref.close(false))
          .finally(() => {
            this.loading = false;
          });
      }
    }
  }
}
