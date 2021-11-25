import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-pedido-status',
  templateUrl: './pedido-status.component.html',
})
export class PedidoStatusComponent  {
  @Input()
  status = 'Pendiente';
}
