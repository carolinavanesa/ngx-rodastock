import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbAlertModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModalModule } from '../../shared/modal/modal.module';
import { SharedAngularMaterialModule } from '../../shared/shared-angular-material.module';
import { SharedPipesModule } from '../../shared/shared-pipes.module';

import { OrdenesService } from '../ordenes/ordenes.service';
import { OrdenClienteCardComponent } from './orden-card-cliente/orden-cliente-card.component';
import { OrdenesClienteComponent } from './ordenes-cliente/ordenes-cliente.component';
import { OrdenesClienteRoutingModule } from './ordenes-cliente-routing.module';
import { OrdenesClienteMainComponent } from './ordenes-cliente-main.component';
import { TipoReparacionService } from '../tipo-reparaciones/tipo-reparaciones.service';
import { ClientesService } from '../clientes/clientes.service';
import { ReviewModalComponent } from './review-modal/review-modal.component';
import { StarRatingComponent } from './star-rating/star-rating.component';

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
    SharedPipesModule,
    OrdenesClienteRoutingModule,
  ],
  declarations: [
    OrdenesClienteMainComponent,
    OrdenesClienteComponent,
    OrdenClienteCardComponent,
    ReviewModalComponent,
    StarRatingComponent
  ],
  providers: [OrdenesService, TipoReparacionService, ClientesService],
})
export class OrdenesClienteModule {}
