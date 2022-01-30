import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { take } from 'rxjs/operators';
import { ModalService } from '../../shared/modal/modal.service';
import { ClientesService } from './clientes.service';
import { NuevoClienteModalComponent } from './nuevo-cliente-modal/nuevo-cliente-modal.component';
import { AlertService } from '../../shared/alert.service';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./clientes.component.scss'],
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit, OnDestroy {
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
      deleteButtonContent: '<i class="nb-trash" data-toggle="tooltip" title="Eliminar cliente"></i>',
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
      barrio: {
        title: 'Barrio',
        type: 'string',
      },
      telefono: {
        title: 'Telefono',
        type: 'number',
      },
      email: {
        title: 'Email',
        type: 'number',
        editable: false,
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private service: ClientesService,
    private modalService: ModalService,
    private dialogService: NbDialogService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.cargarCliente();
  }

  ngOnDestroy() {}

  cargarCliente() {
    this.service.cargarClientes().then((clientes) => {
      this.source.load(clientes);
    });
  }

  onDeleteConfirm(event: any) {
    const config = {
      title: 'Eliminar Cliente',
      body: `Estas seguro que quieres eliminar el cliente ${event.data.nombre}`,
      icon: 'exclamation',
    };
    this.modalService.showConfirmationModal(config).then((res) => {
      if (res) {
        this.service
          .eliminarCliente(event.data.id)
          .then((res) =>
            res ? event.confirm.resolve() : event.confirm.reject()
          );
      }
    });
  }

  onCreateConfirm(event: any) {
    this.service
      .agregarCliente(
        event.newData.nombre,
        event.newData.barrio,
        event.newData.telefono,
        event.newData.email
      )
      .then((res) => {
        if (res) {
          event.confirm.resolve();
          this.cargarCliente();
        } else {
          event.confirm.reject();
        }
      });
  }

  onEditConfirm(event: any) {
    const nombreRegex = new RegExp("^[A-Za-z ']+$");
    const barrioRegex = new RegExp("^[A-Za-z0-9 ']+$");
    const telefonoRegex = new RegExp('[0-9 ()-]+$');

    if (!event.newData.nombre || !nombreRegex.test(event.newData.nombre) || event.newData.nombre.length > 50) {
      this.alertService.showErrorToast(
        'Error',
        'El campo nombre es requerido, solo puede contener letras y un maximo de 50 caracteres'
      );
    } else if (!event.newData.barrio || !barrioRegex.test(event.newData.barrio) || event.newData.barrio.length > 50) {
      this.alertService.showErrorToast(
        'Error',
        'El campo barrio es requerido, solo puede contener letras y un maximo de 50 caracteres'
      );
    } else if (!event.newData.telefono || !telefonoRegex.test(event.newData.telefono) || event.newData.barrio.length > 13) {
      this.alertService.showErrorToast(
        'Error',
        'El campo telefono es requerido, solo puede contener numeros y longitud de maxima de 13'
      );
    } else {
      this.service
        .editarCliente(
          event.newData.id,
          event.newData.nombre,
          event.newData.barrio,
          event.newData.telefono
        )
        .then((res) => {
          if (res) {
            event.confirm.resolve();
            this.cargarCliente();
          } else {
            event.confirm.reject();
          }
        });
    }
  }

  nuevoCliente() {
    this.dialogService
      .open(NuevoClienteModalComponent)
      .onClose.pipe(take(1))
      .toPromise()
      .then((res) => {
        if (res) {
          this.cargarCliente();
        }
      });
  }
}
