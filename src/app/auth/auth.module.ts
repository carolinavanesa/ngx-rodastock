import { NgModule } from '@angular/core';

import { ThemeModule } from '../@theme/theme.module';
import { AuthComponent } from './auth.component';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbLayoutModule, NbActionsModule } from '@nebular/theme';
import { SharedAngularMaterialModule } from '../shared/shared-angular-material.module';
import { TerminosModalComponent } from './terminos-modal/terminos-modal.component';


@NgModule({
  imports: [
    AuthRoutingModule,
    ThemeModule,
    NbActionsModule,
    ReactiveFormsModule,
    NbLayoutModule,
    SharedAngularMaterialModule,
    NbCardModule,
    NbButtonModule
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    RegistroComponent,
    TerminosModalComponent,
  ],
})
export class AuthModule {
}
