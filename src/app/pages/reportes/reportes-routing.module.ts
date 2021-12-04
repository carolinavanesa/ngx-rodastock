import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesMainComponent } from './reportes-main.component';
import { ReporteRepuestoMasUtilizadoComponent } from './repuestos-mas-utilizados/repuestos-mas-utilizados.component';
import { ReporteIngresosMensualesComponent } from './ingresos-mensuales/ingresos-mensuales.component';
import { ClienteMorososComponent } from './cliente-morosos/cliente-morosos.component';
import { ReportePedidosMensualesComponent } from './pedidos-mensuales/pedidos-mensuales.component';
import { EncuestasClienteComponent } from './encuestas-cliente/encuestas-cliente.component';

const routes: Routes = [
  {
    path: '',
    component: ReportesMainComponent,
    children: [
      {
        path: 'reporte1',
        component: ReporteRepuestoMasUtilizadoComponent,
      },
      {
        path: 'reporte2',
        component: ReporteIngresosMensualesComponent,
      },
      {
        path: 'reporte3',
        component: ClienteMorososComponent,
      },
      {
        path: 'reporte4',
        component: EncuestasClienteComponent,
      },


    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesRoutingModule {}
