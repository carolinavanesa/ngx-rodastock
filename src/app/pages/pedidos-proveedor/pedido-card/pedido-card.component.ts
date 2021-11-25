import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EstadosPedidosModalComponent } from '../estados-pedidos-modal/estados-pedidos-modal.component';

@Component({
  selector: 'ngx-pedido-card',
  templateUrl: './pedido-card.component.html',
  styleUrls: ['./pedido-card.component.scss']
})
export class PedidoCardComponent {
  @Input() pedido: any;
  @Output() estadoChanged = new EventEmitter<boolean>();

  constructor(private dialogService: NbDialogService, private router: Router) {}

  openEstadoModal(){
    this.dialogService
      .open(EstadosPedidosModalComponent, {
        context: {
          estado: this.pedido.estado,
          pedido: this.pedido.pedido,
          repuestos: this.pedido.repuestos
        },
      })
      .onClose.pipe(take(1))
      .toPromise()
      .then((res) => {
        if (res) {
          this.pedido.pedido.set('estado', res);
          this.pedido.estado = res;
          this.estadoChanged.emit(true);
        }
      });
  }

  openDetalle(){
    this.router.navigateByUrl(
      `pages/pedidos-proveedor/detalle/${this.pedido.id}`
    );
  }

}
