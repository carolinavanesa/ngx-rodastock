import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../../../shared/modal/modal.service';
import { LocalDataSource } from 'ng2-smart-table';
import { PedidosProveedorService } from '../pedidos-proveedor.service';

@Component({
  templateUrl: './pedidos-proveedor.component.html',
  styleUrls: ['./pedidos-proveedor.component.scss'],
})
export class PedidosProveedorComponent implements OnInit {
  searchText = '';
  pedidos = [];
  pedidosEntregados = [];
  pedidosSolicitados = [];

  constructor(
    private service: PedidosProveedorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarPedidoProveedor();
  }

  cargarPedidoProveedor() {
    this.service.cargarPedidoProveedor().then((pedidos) => {
      this.pedidos = pedidos;
      this.pedidosSolicitados = this.pedidos.filter(
        (o) => o.estado === 'En curso'
      );
      this.pedidosEntregados = this.pedidos.filter(
        (o) => o.estado === 'Recibido'
      );
    });
  }

  // onEdit(event: any) {
  //   this.router.navigateByUrl(
  //     `pages/pedidos-proveedor/editar/${event.data.id}`
  //   );
  // }

  nuevoPedido() {
    this.router.navigateByUrl(`pages/pedidos-proveedor/nuevo`);
  }

  clearSearch() {
    this.searchText = '';
  }
}
