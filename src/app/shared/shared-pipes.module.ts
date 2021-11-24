
import { NgModule } from '@angular/core';
import { FilterOrdenPipe } from '../pages/ordenes/filter-orden.pipe';
import { OrdenStatusComponent } from '../pages/ordenes/orden-status/orden-status.component';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../pages/ordenes-cliente/star-rating/star-rating.component';
import { ThemeModule } from '../@theme/theme.module';
import { NbIconModule } from '@nebular/theme';

@NgModule({
  imports: [CommonModule, ThemeModule, NbIconModule],
  declarations: [
    FilterOrdenPipe,
    OrdenStatusComponent,
    StarRatingComponent
  ],
  exports: [
    FilterOrdenPipe,
    OrdenStatusComponent,
    StarRatingComponent,
  ]
})
export class SharedPipesModule {}
