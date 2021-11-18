import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OrdenesService } from '../../ordenes/ordenes.service';
import { LoginService } from '../../../auth/login/login.service';


@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./ordenes-cliente.component.scss'],
  templateUrl: './ordenes-cliente.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class OrdenesClienteComponent implements OnInit {
  searchText = '';
  ordenes = [];
  ordenesEntrega = [];
  ordenesLista = [];

  constructor(
    private service: OrdenesService,
    private loginService: LoginService,
  ) {}

  ngOnInit() {
    this.cargarOrdenes();
  }

  clearSearch() {
    this.searchText = '';
  }

  cargarOrdenes() {
    this.service.cargarOrdenes().then((ordenes) => {
      const email = this.loginService.getCurrentUser().get('email');
      this.ordenes = ordenes.filter(o => o.cliente.get('email') === email);
      this.ordenesLista = this.ordenes.filter(o => o.estado === 'Terminado');
    });
  }
}
