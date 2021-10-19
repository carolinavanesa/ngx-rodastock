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
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TipoReparacionComponent } from './tipo-reparaciones/tipo-reparaciones.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TipoReparacionRoutingModule } from './tipo-reparaciones-routing.module';
import { TipoReparacionService } from './tipo-reparaciones.service';
import { SharedModalModule } from '../../shared/modal/modal.module';
import { SharedAngularMaterialModule } from '../../shared/shared-angular-material.module';
import { NuevoReparacionComponent } from './nuevo-reparacion/nuevo-reparacion.component';
import { InventarioService } from '../inventario/inventario.service';
import { NuevoRepuestoUnidadModalComponent } from './nuevo-repuesto-unidad-modal/nuevo-repuesto-unidad-modal.component';
import { TipoReparacionesMainComponent } from './tipo-reparaciones-main.component';

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
    Ng2SmartTableModule,
    SharedModalModule,
    SharedAngularMaterialModule,
    TipoReparacionRoutingModule,
  ],
  declarations: [TipoReparacionesMainComponent, TipoReparacionComponent, NuevoReparacionComponent, NuevoRepuestoUnidadModalComponent],
  providers: [TipoReparacionService, InventarioService],
})
export class TipoReparacionModule {}
