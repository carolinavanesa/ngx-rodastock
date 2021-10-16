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
import { FormsModule } from '@angular/forms';
import { ClientesComponent } from './clientes.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesService } from './clientes.service';

@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
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
    ClientesRoutingModule
  ],
  declarations: [
    ClientesComponent
  ],
  providers: [ClientesService]
})
export class ClientesModule { }
