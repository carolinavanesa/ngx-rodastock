import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Location } from '@angular/common';
import { TerminosModalComponent } from '../terminos-modal/terminos-modal.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'my-registro',
  templateUrl: './registro.component.html'
})
export class RegistroComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private dialogService: NbDialogService,
    private location: Location,
  ) {}

  registroForm: FormGroup = this.formBuilder.group({
    password: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(8)]],
    email: [
      '',
      [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(
          "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
        ),
      ],
    ],
    acepto: [
      false,
      [
        Validators.required,
      ],
    ]
  });

  ngOnInit() {}

  register() {
    if (this.registroForm.invalid) {
      return;
    }

    this.loginService.register(
      this.registroForm.get('email').value,
      this.registroForm.get('password').value
    ).then(res => {
      if(res) {
        this.router.navigateByUrl(`auth/login`)
      }
    });
  }

  mostrarTyC(){
    this.dialogService
      .open(TerminosModalComponent)
      .onClose.pipe(take(1))
      .toPromise()
      .then((res) => {
        if (res) {
          this.registroForm.get('acepto').setValue(res);
        }
      });
  }

  goBack() {
    this.location.back();
  }

  faq(){
    this.router.navigateByUrl("faq");
  }
}
