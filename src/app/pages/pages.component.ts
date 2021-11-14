import { Component } from '@angular/core';

import { MENU_ITEMS, MENU_ITEMS_CLIENTE } from './pages-menu';
import { LoginService } from '../auth/login/login.service';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  menu: NbMenuItem[];

  constructor(private loginService: LoginService) {
    const currentUser = this.loginService.getCurrentUser();
    if (currentUser.get('role') === 'admin') {
      this.menu = MENU_ITEMS;
    } else {
      this.menu = MENU_ITEMS_CLIENTE;
    }
  }

}
