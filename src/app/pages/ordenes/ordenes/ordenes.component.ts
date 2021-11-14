import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { OrdenesService } from '../ordenes.service';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./ordenes.component.scss'],
  templateUrl: './ordenes.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class OrdenesComponent implements OnInit {
  searchText = '';
  ordenes = [];
  ordenesEntrega = [];
  ordenesLista = [];

  constructor(
    private service: OrdenesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarOrdenes();
  }

  clearSearch() {
    this.searchText = '';
  }

  cargarOrdenes() {
    this.service.cargarOrdenes().then((ordenes) => {
      this.ordenes = ordenes;
      this.ordenesEntrega = this.ordenes.filter(o => isToday(o.fechaEntrega) && o.estado !== 'Cancelado' && o.estado !== 'Entregado');
      this.ordenesLista = this.ordenes.filter(o => o.estado === 'Terminado');
    });
  }

  nuevaOrden() {
    this.router.navigateByUrl(`pages/ordenes/nueva-orden`);
  }
}

const isToday = (someDate) => {
  const today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}
