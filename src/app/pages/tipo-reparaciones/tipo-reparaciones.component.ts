import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { take } from 'rxjs/operators';
import { ModalService } from '../../shared/modal/modal.service';
import { TipoReparacionService } from './tipo-reparaciones.service';


@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./tipo-reparaciones.component.scss'],
  templateUrl: './tipo-reparaciones.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class TipoReparacionComponent implements OnInit, OnDestroy {
  tipoReparaciones = [];
  searchText = '';

  constructor(
    private service: TipoReparacionService,
    private modalService: ModalService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit() {
    this.cargarTipoReparacion();
  }

  ngOnDestroy() {}

  cargarTipoReparacion() {
    this.service.cargarTipoReparacion().then((tipoReparaciones) => {
      this.tipoReparaciones = tipoReparaciones;
    });
  }

  nuevoTipoReparacion() {
    // this.dialogService
    //   .open(NuevoTipoReparacionModalComponent)
    //   .onClose.pipe(take(1))
    //   .toPromise()
    //   .then((res) => {
    //     if (res) {
    //       this.cargarTipoReparacion();
    //     }
    //   });
  }
}
