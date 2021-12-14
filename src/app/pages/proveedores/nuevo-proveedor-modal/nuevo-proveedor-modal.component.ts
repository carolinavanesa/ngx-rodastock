import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { ProveedoresService } from '../proveedores.service';

@Component({
  selector: 'ngx-nuevo-proveedor-modal',
  templateUrl: './nuevo-proveedor-modal.component.html',
  styleUrls: ['./nuevo-proveedor-modal.component.scss'],
})
export class NuevoProveedorModalComponent {
  constructor(
    protected ref: NbDialogRef<NuevoProveedorModalComponent>,
    private formBuilder: FormBuilder,
    private service: ProveedoresService
  ) {}

  loading = false;

  nuevoForm: FormGroup = this.formBuilder.group({
    nombre: [
      '',
      [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern("[a-zA-Z ,']*"),
      ],
    ],
    direccion: [
      '',
      [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern("[a-zA-Z0-9ñº# ,']*"),
      ],
    ],
    telefono: ['', [Validators.required, Validators.pattern('[0-9 ()-]*')]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(
          "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
        ),
      ],
    ],
  });

  dismiss() {
    this.ref.close(false);
  }

  confirm() {
    if (!this.loading) {
      this.loading = true;
      this.service
        .agregarProveedor(
          this.nuevoForm.get('nombre').value,
          this.nuevoForm.get('direccion').value,
          this.nuevoForm.get('telefono').value,
          this.nuevoForm.get('email').value
        )
        .then((res) => this.ref.close(true))
        .catch((e) => this.ref.close(false))
        .finally(() => {
          this.loading = false;
        });
    }
  }
}
