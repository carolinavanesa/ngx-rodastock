import { Component, OnInit, Input } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { EstadosModalComponent } from '../estados-modal/estados-modal.component';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-orden-card',
  templateUrl: './orden-card.component.html',
  styleUrls: ['./orden-card.component.scss']
})
export class OrdenCardComponent {
  @Input() orden: any;

  constructor(private dialogService: NbDialogService, private router: Router) {}

  openEstadoModal(){
    this.dialogService
      .open(EstadosModalComponent, {
        context: {
          estado: this.orden.estado,
          orden: this.orden.orden,
        },
      })
      .onClose.pipe(take(1))
      .toPromise()
      .then((res) => {
        if (res) {
          this.orden.orden.set('estado', res);
          this.orden.estado = res;
        }
      });
  }

  openDetalle(){
    this.router.navigateByUrl(
      `pages/ordenes/detalle-orden/${this.orden.id}`
    );
  }

}
