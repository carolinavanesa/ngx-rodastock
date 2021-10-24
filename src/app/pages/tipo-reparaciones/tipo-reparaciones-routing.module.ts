import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevoReparacionComponent } from './nuevo-reparacion/nuevo-reparacion.component';
import { TipoReparacionesMainComponent } from './tipo-reparaciones-main.component';
import { TipoReparacionComponent } from './tipo-reparaciones/tipo-reparaciones.component';

const routes: Routes = [
  {
    path: '',
    component: TipoReparacionesMainComponent,
    children: [
      {
        path: '',
        component: TipoReparacionComponent,
      },
      {
        path: 'nueva-reparacion',
        component: NuevoReparacionComponent,
      },
      {
        path: 'editar-reparacion/:id',
        component: NuevoReparacionComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TipoReparacionRoutingModule {
}
