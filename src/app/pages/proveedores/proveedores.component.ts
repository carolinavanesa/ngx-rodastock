import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { take } from 'rxjs/operators';
import { ModalService } from '../../shared/modal/modal.service';
import { NuevoProveedorModalComponent } from './nuevo-proveedor-modal/nuevo-proveedor-modal.component';
import { AlertService } from '../../shared/alert.service';
import { ProveedoresService } from './proveedores.service';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./proveedores.component.scss'],
  templateUrl: './proveedores.component.html',
})
export class ProveedoresComponent implements OnInit, OnDestroy {
  settings = {
    noDataMessage: 'No hay resultados',
    actions: {
      add: false,
    },
    edit: {
      editButtonContent: '<i class="nb-edit" data-toggle="tooltip" title="Editar"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" data-toggle="tooltip" title="Eliminar proveedor"></i>',
      confirmDelete: true,
    },
    columns: {
      // id: {
      //   title: 'ID',
      //   type: 'number',
      //   hide: true,
      //   editable: false,
      // },
      nombre: {
        title: 'Nombre',
        type: 'string',
      },
      direccion: {
        title: 'Direccion',
        type: 'string',
      },
      telefono: {
        title: 'Telefono',
        type: 'string',
      },
      email: {
        title: 'Email',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private service: ProveedoresService,
    private modalService: ModalService,
    private dialogService: NbDialogService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.cargarProveedor();
  }

  ngOnDestroy() {}

  cargarProveedor() {
    this.service.cargarProveedores().then((proveedores) => {
      this.source.load(proveedores);
    });
  }

  onDeleteConfirm(event: any) {
    const config = {
      title: 'Eliminar Proveedor',
      body: `Estas seguro que quieres eliminar el cliente ${event.data.nombre}`,
      icon: 'exclamation',
    };
    this.modalService.showConfirmationModal(config).then((res) => {
      if (res) {
        this.service
          .eliminarProveedor(event.data.id)
          .then((res) =>
            res ? event.confirm.resolve() : event.confirm.reject()
          );
      }
    });
  }

  onCreateConfirm(event: any) {
    this.service
      .agregarProveedor(
        event.newData.nombre,
        event.newData.direccion,
        event.newData.telefono,
        event.newData.email
      )
      .then((res) => {
        if (res) {
          event.confirm.resolve();
          this.cargarProveedor();
        } else {
          event.confirm.reject();
        }
      });
  }

  onEditConfirm(event: any) {
    const nombreRegex = new RegExp("^[A-Za-z ']+$");
    const direccionRegex = new RegExp("^[A-Za-z0-9 ']+$");
    const telefonoRegex = new RegExp('[0-9 ()-]+$');

    if (!event.newData.nombre || !nombreRegex.test(event.newData.nombre) || event.newData.nombre.length > 50) {
      this.alertService.showErrorToast(
        'Error',
        'El campo nombre es requerido, solo puede contener letras y un maximo de 50 caracteres'
      );
    } else if (!event.newData.direccion || !direccionRegex.test(event.newData.direccion) || event.newData.direccion.length > 50) {
      this.alertService.showErrorToast(
        'Error',
        'El campo direccion es requerido, solo puede contener letras y un maximo de 50 caracteres'
      );
    } else if (!event.newData.telefono || !telefonoRegex.test(event.newData.telefono) || event.newData.direccion.length > 13) {
      this.alertService.showErrorToast(
        'Error',
        'El campo telefono es requerido, solo puede contener numeros y longitud de maxima de 13'
      );
    } else {
      this.service
        .editarProveedor(
          event.newData.id,
          event.newData.nombre,
          event.newData.direccion,
          event.newData.telefono
        )
        .then((res) => {
          if (res) {
            event.confirm.resolve();
            this.cargarProveedor();
          } else {
            event.confirm.reject();
          }
        });
    }
  }

  nuevoProveedor() {
    this.dialogService
      .open(NuevoProveedorModalComponent)
      .onClose.pipe(take(1))
      .toPromise()
      .then((res) => {
        if (res) {
          this.cargarProveedor();
        }
      });
  }
}
