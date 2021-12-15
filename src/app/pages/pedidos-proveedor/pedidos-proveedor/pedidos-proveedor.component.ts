import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidosProveedorService } from '../pedidos-proveedor.service';
import { FormControl } from '@angular/forms';

@Component({
  templateUrl: './pedidos-proveedor.component.html',
  styleUrls: ['./pedidos-proveedor.component.scss'],
})
export class PedidosProveedorComponent implements OnInit {
  searchText = '';
  pedidos = [];
  pedidosFull = [];
  pedidosEntregados = [];
  pedidosSolicitados = [];
  estadoFormControl = new FormControl('Todos');

  constructor(
    private service: PedidosProveedorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarPedidoProveedor();

    this.estadoFormControl.valueChanges.subscribe(val => {
      if (val && val !== 'Todos') {
        this.pedidos = this.pedidosFull.filter(x => x.estado === val);
      } else {
        this.pedidos = this.pedidosFull;
      }
    })
  }

  cargarPedidoProveedor() {
    this.service.cargarPedidoProveedor().then((pedidos) => {
      this.pedidos = pedidos;
      this.pedidosFull = [...pedidos];
      this.pedidosSolicitados = this.pedidos.filter(
        (o) => o.estado === 'En curso'
      );
      this.pedidosEntregados = this.pedidos.filter(
        (o) => o.estado === 'Recibido'
      );
    });
  }

  nuevoPedido() {
    this.router.navigateByUrl(`pages/pedidos-proveedor/nuevo`);
  }

  clearSearch() {
    this.searchText = '';
  }
}
