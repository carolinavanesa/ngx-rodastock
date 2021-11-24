import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() estadoChanged = new EventEmitter<boolean>();

  constructor(private dialogService: NbDialogService, private router: Router) {}

  openEstadoModal(){
    this.dialogService
      .open(EstadosModalComponent, {
        context: {
          estado: this.orden.estado,
          orden: this.orden.orden,
          calificacion: this.orden.calificacion,
        },
      })
      .onClose.pipe(take(1))
      .toPromise()
      .then((res) => {
        if (res) {
          this.orden.orden.set('estado', res);
          this.orden.estado = res;
          this.estadoChanged.emit(true);
        }
      });
  }

  openDetalle(){
    this.router.navigateByUrl(
      `pages/ordenes/detalle-orden/${this.orden.id}`
    );
  }

}
