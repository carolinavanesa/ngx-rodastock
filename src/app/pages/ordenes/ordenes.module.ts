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

import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { OrdenesRoutingModule } from './ordenes-routing.module';
import { OrdenesService } from './ordenes.service';
import { SharedModalModule } from '../../shared/modal/modal.module';
import { SharedAngularMaterialModule } from '../../shared/shared-angular-material.module';
import { TipoReparacionService } from '../tipo-reparaciones/tipo-reparaciones.service';
import { OrdenesMainComponent } from './ordenes-main.component';
import { OrdenesComponent } from './ordenes/ordenes.component';
import { FilterOrdenPipe } from './filter-orden.pipe';
import { OrdenStatusComponent } from './orden-status/orden-status.component';
import { NuevoOrdenComponent } from './nuevo-orden/nuevo-orden.component';
import { ClientesService } from '../clientes/clientes.service';
import { InventarioService } from '../inventario/inventario.service';
import { AgregarReparacionModalComponent } from './agregar-reparacion-modal/agregar-reparacion-modal.component';
import { OrdenCardComponent } from './orden-card/orden-card.component';
import { EstadosModalComponent } from './estados-modal/estados-modal.component';
import { DetalleOrdenComponent } from './detalle-orden/detalle-orden.component';

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
    Ng2SmartTableModule,
    SharedModalModule,
    SharedAngularMaterialModule,
    OrdenesRoutingModule,
  ],
  declarations: [
    OrdenesMainComponent,
    OrdenesComponent,
    OrdenStatusComponent,
    NuevoOrdenComponent,
    AgregarReparacionModalComponent,
    FilterOrdenPipe,
    OrdenCardComponent,
    EstadosModalComponent,
    DetalleOrdenComponent,
  ],
  providers: [OrdenesService, InventarioService, ClientesService, TipoReparacionService],
})
export class OrdenesModule {}
