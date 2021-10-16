import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
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

  nuevoForm: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.maxLength(30), Validators.pattern("[a-zA-Z ,']*")]],
    barrio: ['', [Validators.required, Validators.maxLength(30), Validators.pattern("[a-zA-Z0-9 ,']*")]],
    telefono: ['', [Validators.required, Validators.pattern('[0-9 ()-]*')]],
  });

  // matcher = new MyErrorStateMatcher();

  dismiss() {
    this.ref.close(false);
  }

  confirm() {
    this.service
      .agregarCliente(
        this.nuevoForm.get('nombre').value,
        this.nuevoForm.get('barrio').value,
        Number(this.nuevoForm.get('telefono').value)
      )
      .then((res) => this.ref.close(true))
      .catch((e) => this.ref.close(false));
  }
}
