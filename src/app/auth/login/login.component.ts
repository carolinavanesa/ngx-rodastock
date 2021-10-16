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
      username: ['', Validators.required],
      password: ['', Validators.required],
    })

    ngOnInit(){

    }

    async login() {
      if (this.loginForm.invalid) {
        return;
      }

      this.loginService.login(this.loginForm.get('username').value, this.loginForm.get('password').value);
    }

    getConfigValue(key: string): any {}
}

