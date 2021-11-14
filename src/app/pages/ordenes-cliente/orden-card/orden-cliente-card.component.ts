import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-orden-cliente-card',
  templateUrl: './orden-cliente-card.component.html',
  styleUrls: ['./orden-cliente-card.component.scss']
})
export class OrdenClienteCardComponent {
  @Input() orden: any;
  @Output() estadoChanged = new EventEmitter<boolean>();

  constructor(private dialogService: NbDialogService, private router: Router) {}

  openDetalle(){
    this.router.navigateByUrl(
      `pages/ordenes/detalle-orden/${this.orden.id}`
    );
  }

}
