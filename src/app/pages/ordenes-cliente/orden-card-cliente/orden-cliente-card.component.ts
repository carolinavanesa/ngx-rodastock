import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Router } from '@angular/router';
import { ReviewModalComponent } from '../review-modal/review-modal.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ngx-orden-cliente-card',
  templateUrl: './orden-cliente-card.component.html',
  styleUrls: ['./orden-cliente-card.component.scss']
})
export class OrdenClienteCardComponent {
  @Input() orden: any;
  // @Output() estadoChanged = new EventEmitter<boolean>();

  constructor(private dialogService: NbDialogService, private router: Router) {}

  openDetalle(){
    this.router.navigateByUrl(
      `pages/mis-pedidos/detalle-orden/${this.orden.id}`
    );
  }

  openReview(){
    this.dialogService
    .open(ReviewModalComponent, {
      context: {
        orden: this.orden.orden,
        calificacion: this.orden.calificacion,
      },
    })
    .onClose.pipe(take(1))
    .toPromise()
    .then((res) => {
      if (res) {
        // this.orden.orden.set('estado', res);
        // this.orden.estado = res;
        // this.estadoChanged.emit(true);
      }
    });
  }

}
