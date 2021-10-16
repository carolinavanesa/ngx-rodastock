import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TipoReparacionComponent } from './tipo-reparaciones.component';

const routes: Routes = [
  {
    path: '',
    component: TipoReparacionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TipoReparacionRoutingModule {
}
