import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidosProveedorService } from '../pedidos-proveedor.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

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
  dateForm: FormGroup = this.formBuilder.group({
    desde: '',
    hasta: '',
  })


  constructor(
    private service: PedidosProveedorService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.cargarPedidoProveedor();

    this.estadoFormControl.valueChanges.subscribe(val => {
      if (val && val !== 'Todos') {
        this.pedidos = this.pedidosFull.filter(x => x.estado === val);
      } else {
        this.pedidos = this.pedidosFull;
      }
    });

    this.dateForm.valueChanges.subscribe(val => {
      this.service.cargarPedidoProveedor(val.desde, val.hasta).then(pedidos => {
        this.pedidos = pedidos;
        this.pedidosFull = [...pedidos];
      });
    });
  }

  clearDateSearch() {
    this.cargarPedidoProveedor();
    this.dateForm.reset();
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
