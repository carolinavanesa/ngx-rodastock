import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrdenesService } from '../ordenes.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./ordenes.component.scss'],
  templateUrl: './ordenes.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class OrdenesComponent implements OnInit {
  searchText = '';
  estadoFormControl = new FormControl('Todos');
  ordenes = [];
  ordenesFull = [];
  ordenesEntrega = [];
  ordenesLista = [];

  constructor(
    private service: OrdenesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cargarOrdenes();

    const search = this.route.snapshot.paramMap.get('search');
    if (search) {
      this.searchText = search;
    }

    this.estadoFormControl.valueChanges.subscribe(val => {
      if (val && val !== 'Todos') {
        this.ordenes = this.ordenesFull.filter(x => x.estado === val);
      } else {
        this.ordenes = this.ordenesFull;
      }
    })
  }

  clearSearch() {
    this.searchText = '';
  }

  cargarOrdenes() {
    this.service.cargarOrdenes().then((ordenes) => {
      this.ordenes = ordenes;
      this.ordenesFull = [...ordenes];
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
