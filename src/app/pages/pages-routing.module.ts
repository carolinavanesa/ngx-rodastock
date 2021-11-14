import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AdminGuard } from './admin.guard';
import { ClientGuard } from './client.guard';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard', // Convertir en input de ambos roles
      // canActivate: [AdminGuard],
      component: DashboardComponent,
    },
    {
      path: 'clientes',
      canActivate: [AdminGuard],
      loadChildren: () => import('./clientes/clientes.module')
        .then(m => m.ClientesModule),
    },
    {
      path: 'inventario',
      canActivate: [AdminGuard],
      loadChildren: () => import('./inventario/inventario.module')
        .then(m => m.InventarioModule),
    },
    {
      path: 'tipo-reparaciones',
      canActivate: [AdminGuard],
      loadChildren: () => import('./tipo-reparaciones/tipo-reparaciones.module')
        .then(m => m.TipoReparacionModule),
    },
    {
      path: 'ordenes',
      canActivate: [AdminGuard],
      loadChildren: () => import('./ordenes/ordenes.module')
        .then(m => m.OrdenesModule),
    },
    {
      path: 'mis-pedidos',
      canActivate: [ClientGuard],
      loadChildren: () => import('./ordenes-cliente/ordenes-cliente.module')
        .then(m => m.OrdenesClienteModule),
    },
    // {
    //   path: 'miscellaneous',
    //   loadChildren: () => import('./miscellaneous/miscellaneous.module')
    //     .then(m => m.MiscellaneousModule),
    // },
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
