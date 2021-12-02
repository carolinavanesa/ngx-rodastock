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
  ],
  declarations: [
    ReportesMainComponent,
    ReporteRepuestoMasUtilizadoComponent,
    RepuestosMasUtilizadosPieComponent,
    ReporteIngresosMensualesComponent,
    IngresosMensualesBarComponent,
    ClienteMorososComponent
  ],
  providers: [ReportesService],
})
export class ReportesModule {}
