import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'clientes',
      loadChildren: () => import('./clientes/clientes.module')
        .then(m => m.ClientesModule),
    },
    {
      path: 'inventario',
      loadChildren: () => import('./inventario/inventario.module')
        .then(m => m.InventarioModule),
    },
    {
      path: 'tipo-reparaciones',
      loadChildren: () => import('./tipo-reparaciones/tipo-reparaciones.module')
        .then(m => m.TipoReparacionModule),
    },
    {
      path: 'miscellaneous',
      loadChildren: () => import('./miscellaneous/miscellaneous.module')
        .then(m => m.MiscellaneousModule),
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
