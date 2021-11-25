import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventarioComponent } from './inventario/inventario.component';
import { DetalleRepuestoComponent } from './detalle-repuesto/detalle-repuesto.component';
import { InventarioMainComponent } from './inventario-main.component';

const routes: Routes = [
  {
    path: '',
    component: InventarioMainComponent,
    children: [
      {
        path: '',
        component: InventarioComponent,
      },
      {
        path: 'detalle/:id',
        component: DetalleRepuestoComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventarioRoutingModule {
}
