import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdenesMainComponent } from './ordenes-main.component';
import { OrdenesComponent } from './ordenes/ordenes.component';
import { NuevoOrdenComponent } from './nuevo-orden/nuevo-orden.component';
import { DetalleOrdenComponent } from './detalle-orden/detalle-orden.component';

const routes: Routes = [
  {
    path: '',
    component: OrdenesMainComponent,
    children: [
      {
        path: '',
        component: OrdenesComponent,
      },
        {
        path: 'search/:search',
        component: OrdenesComponent,
      },
      {
        path: 'nueva-orden',
        component: NuevoOrdenComponent,
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
export class OrdenesRoutingModule {
}
