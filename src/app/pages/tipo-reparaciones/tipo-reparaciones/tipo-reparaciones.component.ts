import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { take } from 'rxjs/operators';
import { ModalService } from '../../../shared/modal/modal.service';
import { TipoReparacionService } from '../tipo-reparaciones.service';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./tipo-reparaciones.component.scss'],
  templateUrl: './tipo-reparaciones.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class TipoReparacionComponent implements OnInit, OnDestroy {
  settings = {
    noDataMessage: 'No hay resultados',
    mode: 'external',
    actions: {
      add: false,
      columnTitle: '',
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit" data-toggle="tooltip" title="Editar"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" data-toggle="tooltip" title="Eliminar reparación"></i>',
      confirmDelete: true,
    },
    columns: {
      // id: {
      //   title: 'ID',
      //   type: 'text',
      //   hide: true,
      //   editable: false,
      // },
      nombre: {
        title: 'Nombre',
        type: 'text',
      },
      descripcion: {
        title: 'descripcion',
        type: 'html',
      },
      tiempoEstimado: {
        title: 'Tiempo Estimado',
        type: 'text',
      },
      costoMano: {
        title: 'Costo Mano Obra',
        type: 'text',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private service: TipoReparacionService,
    private modalService: ModalService,
    private dialogService: NbDialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarTipoReparacion();
  }

  ngOnDestroy() {}

  cargarTipoReparacion() {
    this.service.cargarTipoReparacion().then((tipoReparaciones) => {
      this.source.load(tipoReparaciones);
    });
  }

  onDelete(event: any) {
    const config = {
      title: 'Eliminar Tipo de Reparacion',
      body: `Estas seguro que quieres eliminar el tipo de reparacion ${event.data.nombre}`,
      icon: 'exclamation',
    };
    this.modalService.showConfirmationModal(config).then((res) => {
      if (res) {
        this.service
          .eliminarTipoReparacion(event.data.id)
          .then((res) => this.cargarTipoReparacion());
      }
    });
  }

  onEdit(event: any) {
    this.router.navigateByUrl(
      `pages/tipo-reparaciones/editar-reparacion/${event.data.id}`
    );
  }

  nuevoTipoReparacion() {
    this.router.navigateByUrl(`pages/tipo-reparaciones/nueva-reparacion`);
  }
}
