import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbAccordionModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { SharedAngularMaterialModule } from '../../shared/shared-angular-material.module';
import { FaqComponent } from './faq.component';
import { FaqRoutingModule } from './faq-routing.module';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbAccordionModule,
    NbIconModule,
    NbButtonModule,
    SharedAngularMaterialModule,
    FaqRoutingModule
  ],
  declarations: [FaqComponent],
})
export class FaqModule {}
