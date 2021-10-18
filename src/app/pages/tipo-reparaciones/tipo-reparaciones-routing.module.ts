import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevoReparacionComponent } from './nuevo-reparacion/nuevo-reparacion.component';
import { TipoReparacionComponent } from './tipo-reparaciones.component';

const routes: Routes = [
  {
    path: '',
    component: TipoReparacionComponent,
    children: [
      {
        path: 'reparacion/:id',
        component: NuevoReparacionComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TipoReparacionRoutingModule {
}
