import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-orden-status',
  templateUrl: './orden-status.component.html',
})
export class OrdenStatusComponent  {
  @Input()
  status = 'Pendiente';
}
