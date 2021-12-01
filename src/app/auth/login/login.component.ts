import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';


@Component({
  selector: 'my-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

    constructor(private formBuilder: FormBuilder, private loginService: LoginService) {}

    loginForm: FormGroup = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(
          "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
        ),
      ]],
      password: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(8)]],
    })

    ngOnInit(){

    }

    async login() {
      if (this.loginForm.invalid) {
        return;
      }

      this.loginService.login(this.loginForm.get('email').value, this.loginForm.get('password').value);
    }

    getConfigValue(key: string): any {}
}

