import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { NbDialogRef } from '@nebular/theme';
import { ClientesService } from '../clientes.service';

/** Error when invalid control is dirty, touched, or submitted. */
// export class MyErrorStateMatcher implements ErrorStateMatcher {
//   isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//     const isSubmitted = form && form.submitted;
//     return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//   }
// }

@Component({
  selector: 'ngx-nuevo-cliente-modal',
  templateUrl: './nuevo-cliente-modal.component.html',
  styleUrls: ['./nuevo-cliente-modal.component.scss'],
})
export class NuevoClienteModalComponent {
  constructor(
    protected ref: NbDialogRef<NuevoClienteModalComponent>,
    private formBuilder: FormBuilder,
    private service: ClientesService
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
    barrio: [
      '',
      [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern("[a-zA-Z0-9 ,']*"),
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
        .agregarCliente(
          this.nuevoForm.get('nombre').value,
          this.nuevoForm.get('barrio').value,
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
