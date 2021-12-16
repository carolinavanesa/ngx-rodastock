import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbStepperModule,
  NbAlertModule,
  NbUserModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModalModule } from '../../shared/modal/modal.module';
import { SharedAngularMaterialModule } from '../../shared/shared-angular-material.module';

import { ReportesMainComponent } from './reportes-main.component';
import { ReporteRepuestoMasUtilizadoComponent } from './repuestos-mas-utilizados/repuestos-mas-utilizados.component';
import { RepuestosMasUtilizadosPieComponent } from './repuestos-mas-utilizados/repuestos-mas-utilizados-pie';
import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesService } from './reportes.service';
import { ReporteIngresosMensualesComponent } from './ingresos-mensuales/ingresos-mensuales.component';
import { IngresosMensualesBarComponent } from './ingresos-mensuales/ingresos-mensuales-bar.component';
import { ClienteMorososComponent } from './cliente-morosos/cliente-morosos.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ReportePedidosMensualesComponent } from './pedidos-mensuales/pedidos-mensuales.component';
import { PedidosMultipleXaxisComponent } from './pedidos-mensuales/pedidos-multiple-xaxis.component';
import { SharedPipesModule } from '../../shared/shared-pipes.module';
import { EncuestasClienteComponent } from './encuestas-cliente/encuestas-cliente.component';
import { ReportePagosProveedoresComponent } from './pagos-proveedores/pagos-proveedores.component';

@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    ReactiveFormsModule,
    NbCardModule,
    NbButtonModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NbStepperModule,
    NbAlertModule,
    SharedModalModule,
    SharedAngularMaterialModule,
    ReportesRoutingModule,
    NgxEchartsModule,
    NgxChartsModule,
    Ng2SmartTableModule,
    SharedPipesModule,
    NbUserModule,
  ],
  declarations: [
    ReportesMainComponent,
    ReporteRepuestoMasUtilizadoComponent,
    RepuestosMasUtilizadosPieComponent,
    ReporteIngresosMensualesComponent,
    IngresosMensualesBarComponent,
    ClienteMorososComponent,
    ReportePedidosMensualesComponent,
    PedidosMultipleXaxisComponent,
    EncuestasClienteComponent,
    ReportePagosProveedoresComponent,
  ],
  providers: [ReportesService],
})
export class ReportesModule {}
