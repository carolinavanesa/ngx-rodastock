import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PedidosProveedorMainComponent } from './pedidos-proveedor-main.component';
import { PedidosProveedorComponent } from './pedidos-proveedor/pedidos-proveedor.component';
import { NuevoPedidoComponent } from './nuevo-pedido/nuevo-pedido.component';
import { DetallePedidoComponent } from './detalle-pedido/detalle-pedido.component';

const routes: Routes = [
  {
    path: '',
    component: PedidosProveedorMainComponent,
    children: [
      {
        path: '',
        component: PedidosProveedorComponent,
      },
      {
        path: 'nuevo',
        component: NuevoPedidoComponent,
      },
      {
        path: 'detalle/:id',
        component: DetallePedidoComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidosProveedorRoutingModule { }
