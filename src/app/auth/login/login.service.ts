import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Parse } from "parse";
import { AlertService } from "../../shared/alert.service";

@Injectable()
export class LoginService {
  constructor(private router: Router, private alertService: AlertService) {}

  async login(username: string, password: string) {
    try {
      await Parse.User.logIn(username, password);

      if(Parse.User.current()?.get('role') === 'admin') {
        this.router.navigateByUrl("pages/ordenes");
      } else {
        this.router.navigateByUrl("pages/mis-pedidos");
      }
    } catch (e) {
      this.alertService.showErrorToast("Error", "Por favor compruebe que los datos ingresados son correctos");
    }
  }

  async logout() {
    try {
      await Parse.User.logOut();
      this.alertService.showPrimaryToast("Exito","Se ha deslogueado correctamente");
      this.router.navigateByUrl("auth/login");
    } catch (e) {
      this.alertService.showErrorToast("Error","No se puede desloguear. Intente nuevamente");
    }
  }

  async register(email: string, password: string) {
    // Create a new instance of the user class
    var user = new Parse.User();
    const username = email.split('@')[0];
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);

    try {
      const res = await user.signUp();
      this.alertService.showSuccessToast("Exito","Se ha registrado correctamente");
      return true;
    } catch (error) {
      this.alertService.showErrorToast("Error", "No se ha podido registrar");
      return false;
    }
}

  getCurrentUser() {
    return Parse.User.current();
  }
}
