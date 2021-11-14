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
import { SharedModalModule } from '../../shared/modal/modal.module';
import { SharedAngularMaterialModule } from '../../shared/shared-angular-material.module';

import { TipoReparacionService } from '../tipo-reparaciones/tipo-reparaciones.service';
import { ClientesService } from '../clientes/clientes.service';
import { OrdenesService } from '../ordenes/ordenes.service';
import { InventarioService } from '../inventario/inventario.service';

import { OrdenClienteCardComponent } from './orden-card/orden-cliente-card.component';
import { OrdenStatusComponent } from '../ordenes/orden-status/orden-status.component';
import { FilterOrdenPipe } from '../ordenes/filter-orden.pipe';
import { DetalleOrdenComponent } from '../ordenes/detalle-orden/detalle-orden.component';

import { OrdenesClienteComponent } from './ordenes/ordenes-cliente.component';
import { OrdenesClienteRoutingModule } from './ordenes-cliente-routing.module';
import { OrdenesClienteMainComponent } from './ordenes-cliente-main.component';
import { OrdenesModule } from '../ordenes/ordenes.module';

@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    ReactiveFormsModule,
    NbCardModule,
    NbButtonModule,
    NbTabsetModule,
    NbActionsModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NbAlertModule,
    Ng2SmartTableModule,
    SharedModalModule,
    SharedAngularMaterialModule,
    OrdenesClienteRoutingModule,
    OrdenesModule,
  ],
  declarations: [
    OrdenesClienteMainComponent,
    OrdenesClienteComponent,
    OrdenClienteCardComponent,
    // OrdenStatusComponent,
    FilterOrdenPipe,
    // DetalleOrdenComponent,
  ],
  providers: [OrdenesService],
})
export class OrdenesClienteModule {}
