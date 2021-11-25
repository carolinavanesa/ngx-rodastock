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
import { InventarioComponent } from './inventario/inventario.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { InventarioRoutingModule } from './inventario-routing.module';
import { InventarioService } from './inventario.service';
import { SharedModalModule } from '../../shared/modal/modal.module';
import { NuevoRepuestoModalComponent } from './nuevo-repuesto-modal/nuevo-repuesto-modal.component';
import { SharedAngularMaterialModule } from '../../shared/shared-angular-material.module';
import { DetalleRepuestoComponent } from './detalle-repuesto/detalle-repuesto.component';
import { InventarioMainComponent } from './inventario-main.component';

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
    InventarioRoutingModule,
  ],
  declarations: [InventarioComponent, InventarioMainComponent, NuevoRepuestoModalComponent, DetalleRepuestoComponent],
  providers: [InventarioService],
})
export class InventarioModule {}
