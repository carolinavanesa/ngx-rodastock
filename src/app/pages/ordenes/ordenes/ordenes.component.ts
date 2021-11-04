import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { ModalService } from '../../../shared/modal/modal.service';
import { OrdenesService } from '../ordenes.service';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./ordenes.component.scss'],
  templateUrl: './ordenes.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class OrdenesComponent implements OnInit, OnDestroy {
  searchText = '';
  ordenes = [];

  constructor(
    private service: OrdenesService,
    private modalService: ModalService,
    private dialogService: NbDialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarOrdenes();
  }

  ngOnDestroy() {}

  cargarOrdenes() {
    this.service.cargarOrdenes().then((ordenes) => {
      this.ordenes = ordenes;
    });
  }

  nuevaOrden() {
    this.router.navigateByUrl(`pages/ordenes/nueva-orden`);
  }
}
