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
import { ClientesComponent } from './clientes.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesService } from './clientes.service';
import { SharedModalModule } from '../../shared/modal/modal.module';
import { NuevoClienteModalComponent } from './nuevo-cliente-modal/nuevo-cliente-modal.component';
import { SharedAngularMaterialModule } from '../../shared/shared-angular-material.module';

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
    ClientesRoutingModule,
  ],
  declarations: [ClientesComponent, NuevoClienteModalComponent],
  providers: [ClientesService],
})
export class ClientesModule {}
