import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'my-registro',
  templateUrl: './registro.component.html',
})
export class RegistroComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
  ) {}

  registroForm: FormGroup = this.formBuilder.group({
    password: ['', Validators.required, Validators.maxLength(30), Validators.minLength(8)],
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
}
