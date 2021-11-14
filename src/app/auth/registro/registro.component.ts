import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'my-registro',
  templateUrl: './registro.component.html',
})
export class RegistroComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) {}

  registroForm: FormGroup = this.formBuilder.group({
    password: ['', Validators.required],
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
    );
  }
}
