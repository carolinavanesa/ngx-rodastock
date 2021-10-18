import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { TipoReparacionService } from '../tipo-reparaciones.service';

@Component({
  selector: 'ngx-nuevo-reparacion-modal',
  templateUrl: './nuevo-reparacion.component.html',
  styleUrls: ['./nuevo-reparacion.component.scss'],
})
export class NuevoReparacionComponent {
  constructor(
    private formBuilder: FormBuilder,
    private service: TipoReparacionService
  ) {}

  nuevoForm: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.maxLength(30), Validators.pattern("[a-zA-Z0-9 ,']*")]],
    descripcion: ['', [Validators.maxLength(600)]],
    tiempoEstimadoMedida: '',
    tiempoEstimadoUnidad: ['', [Validators.pattern('[0-9]')]],
  });

  confirm() {
    this.service
      .agregarTipoReparacion(
        this.nuevoForm.get('nombre').value,
        this.nuevoForm.get('descripcion').value,
        this.nuevoForm.get('tiempoEstimado').value
      )
      // .then((res) => this.ref.close(true))
      // .catch((e) => this.ref.close(false));
  }
}
