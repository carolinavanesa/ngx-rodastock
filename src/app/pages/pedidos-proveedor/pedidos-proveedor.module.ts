import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PedidosProveedorRoutingModule } from './pedidos-proveedor-routing.module';
import { PedidosProveedorMainComponent } from './pedidos-proveedor-main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import {
  NbCardModule,
  NbButtonModule,
  NbTabsetModule,
  NbActionsModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbStepperModule,
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModalModule } from '../../shared/modal/modal.module';
import { SharedAngularMaterialModule } from '../../shared/shared-angular-material.module';
import { PedidosProveedorComponent } from './pedidos-proveedor/pedidos-proveedor.component';
import { NuevoPedidoComponent } from './nuevo-pedido/nuevo-pedido.component';
import { DetallePedidoComponent } from './detalle-pedido/detalle-pedido.component';
import { PedidoCardComponent } from './pedido-card/pedido-card.component';
import { EstadosPedidosModalComponent } from './estados-pedidos-modal/estados-pedidos-modal.component';
import { PedidoStatusComponent } from './pedido-status/pedido-status.component';
import { PedidosProveedorService } from './pedidos-proveedor.service';
import { InventarioService } from '../inventario/inventario.service';
import { FilterPedidoPipe } from './filter-pedido.pipe';
import { ProveedoresService } from '../proveedores/proveedores.service';

@NgModule({
  declarations: [
    PedidosProveedorMainComponent,
    PedidosProveedorComponent,
    NuevoPedidoComponent,
    DetallePedidoComponent,
    PedidoCardComponent,
    EstadosPedidosModalComponent,
    PedidoStatusComponent,
    FilterPedidoPipe
  ],
  imports: [
    CommonModule,
    PedidosProveedorRoutingModule,
    FormsModule,
    ThemeModule,
    ReactiveFormsModule,
    NbCardModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NbStepperModule,
    Ng2SmartTableModule,
    SharedModalModule,
    SharedAngularMaterialModule,
  ],
  providers: [PedidosProveedorService, InventarioService, ProveedoresService],
})
export class PedidosProveedorModule {}
