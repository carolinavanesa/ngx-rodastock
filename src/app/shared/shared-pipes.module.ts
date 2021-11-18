
import { NgModule } from '@angular/core';
import { FilterOrdenPipe } from '../pages/ordenes/filter-orden.pipe';
import { OrdenStatusComponent } from '../pages/ordenes/orden-status/orden-status.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [
    FilterOrdenPipe,
    OrdenStatusComponent,
  ],
  exports: [
    FilterOrdenPipe,
    OrdenStatusComponent,
  ]
})
export class SharedPipesModule {}
