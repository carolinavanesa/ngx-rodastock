import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdenesClienteMainComponent } from './ordenes-cliente-main.component';
import { OrdenesClienteComponent } from './ordenes/ordenes-cliente.component';
import { DetalleOrdenComponent } from '../ordenes/detalle-orden/detalle-orden.component';

const routes: Routes = [
  {
    path: '',
    component: OrdenesClienteMainComponent,
    children: [
      {
        path: '',
        component: OrdenesClienteComponent,
      },
      {
        path: 'detalle-orden/:id',
        component: DetalleOrdenComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdenesClienteRoutingModule {
}
