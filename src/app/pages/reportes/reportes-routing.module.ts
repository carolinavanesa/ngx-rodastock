import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesMainComponent } from './reportes-main.component';
import { ReporteRepuestoMasUtilizadoComponent } from './repuestos-mas-utilizados/repuestos-mas-utilizados.component';
import { ReporteIngresosMensualesComponent } from './ingresos-mensuales/ingresos-mensuales.component';

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportesRoutingModule {}