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
      this.router.navigateByUrl("/pages");
    } catch (e) {
      this.alertService.showPrimaryToast("Error", "Por favor compruebe que los datos ingresados son correctos");
    }
  }

  async logout() {
    try {
      await Parse.User.logOut();
      this.alertService.showPrimaryToast("Exito","Se ha deslogueado correctamente");
      this.router.navigateByUrl("auth/login");
    } catch (e) {
      this.alertService.showPrimaryToast("Error","No se puede desloguear. Intente nuevamente");
    }
  }
}
