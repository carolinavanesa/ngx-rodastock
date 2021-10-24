import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { InventarioService } from '../../inventario/inventario.service';

@Component({
  selector: 'ngx-nuevo-repuesto-unidad-modal',
  templateUrl: './nuevo-repuesto-unidad-modal.component.html',
  styleUrls: ['./nuevo-repuesto-unidad-modal.component.scss'],
})
export class NuevoRepuestoUnidadModalComponent {
  constructor(
    protected ref: NbDialogRef<NuevoRepuestoUnidadModalComponent>,
    private formBuilder: FormBuilder,
    private service: InventarioService
  ) {}
  repuestoOptions = [];

  nuevoForm: FormGroup = this.formBuilder.group({
    repuesto: ['' , [Validators.required]],
    cantidad: ['', [Validators.required, Validators.maxLength(3), Validators.pattern('[0-9]*')]],
  });

  ngOnInit() {
    this.service.cargarInventarioForNuevaUnidad().then(repuestos => this.repuestoOptions = repuestos)
  }

  dismiss() {
    this.ref.close(false);
  }

  confirm() {
    // Objeto completo de unidad para ser guardado en la pantalla de reparacion
    const repuesto = this.repuestoOptions.find(r => r.id === this.nuevoForm.get('repuesto').value)

    this.ref.close({
      nombre: repuesto.get('nombre'),
      repuesto: repuesto,
      cantidad: this.nuevoForm.get('cantidad').value
    })
  }
}
