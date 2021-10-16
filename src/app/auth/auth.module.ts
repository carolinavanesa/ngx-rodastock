import { NgModule } from '@angular/core';

import { ThemeModule } from '../@theme/theme.module';
import { AuthComponent } from './auth.component';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbLayoutModule } from '@nebular/theme';
import { SharedAngularMaterialModule } from '../shared/shared-angular-material.module';


@NgModule({
  imports: [
    AuthRoutingModule,
    ThemeModule,
    ReactiveFormsModule,
    NbLayoutModule,
    SharedAngularMaterialModule,
    NbCardModule,
    NbButtonModule
  ],
  declarations: [
    AuthComponent,
    LoginComponent
  ],
})
export class AuthModule {
}
