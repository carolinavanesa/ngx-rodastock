import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdenesMainComponent } from './ordenes-main.component';
import { OrdenesComponent } from './ordenes/ordenes.component';
import { NuevoOrdenComponent } from './nuevo-orden/nuevo-orden.component';

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
        path: 'nueva-reparacion',
        component: NuevoOrdenComponent,
      },
      // {
      //   path: 'editar-reparacion/:id',
      //   component: NuevoReparacionComponent,
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdenesRoutingModule {
}
