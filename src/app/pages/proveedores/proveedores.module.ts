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
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ProveedoresRoutingModule } from './proveedores-routing.module';
import { SharedModalModule } from '../../shared/modal/modal.module';
import { SharedAngularMaterialModule } from '../../shared/shared-angular-material.module';
import { ProveedoresComponent } from './proveedores.component';
import { ProveedoresService } from './proveedores.service';
import { NuevoProveedorModalComponent } from './nuevo-proveedor-modal/nuevo-proveedor-modal.component';

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
    ProveedoresRoutingModule,
  ],
  declarations: [ProveedoresComponent, NuevoProveedorModalComponent],
  providers: [ProveedoresService],
})
export class ProveedoresModule {}
