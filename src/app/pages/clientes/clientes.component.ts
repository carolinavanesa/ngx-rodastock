import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { take } from 'rxjs/operators';
import { ModalService } from '../../shared/modal/modal.service';
import { ClientesService } from './clientes.service';
import { NuevoClienteModalComponent } from './nuevo-cliente-modal/nuevo-cliente-modal.component';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./clientes.component.scss'],
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit, OnDestroy {
  settings = {
    actions: {
      add: false,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        hide: true,
        editable: false,
      },
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
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private service: ClientesService,
    private modalService: ModalService,
    private dialogService: NbDialogService
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
        event.newData.email,
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
    this.service
      .editarCliente(
        event.newData.id,
        event.newData.nombre,
        event.newData.barrio,
        Number(event.newData.telefono)
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
