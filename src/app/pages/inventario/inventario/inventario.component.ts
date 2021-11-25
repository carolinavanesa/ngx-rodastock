import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { take } from 'rxjs/operators';
import { ModalService } from '../../../shared/modal/modal.service';
import { InventarioService } from '../inventario.service';
import { NuevoRepuestoModalComponent } from '../nuevo-repuesto-modal/nuevo-repuesto-modal.component';
import { AlertService } from '../../../shared/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./inventario.component.scss'],
  templateUrl: './inventario.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class InventarioComponent implements OnInit, OnDestroy {
  settings = {
    actions: {
      add: false,
      columnTitle: ''
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
        type: 'text',
        hide: true,
        editable: false,
      },
      nombre: {
        title: 'Nombre',
        type: 'text',
      },
      costo: {
        title: 'Costo',
        type: 'text',
      },
      stock: {
        title: 'Stock',
        type: 'text',
        editable: false,
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private service: InventarioService,
    private modalService: ModalService,
    private dialogService: NbDialogService,
    private alertService: AlertService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.cargarInventario();
  }

  ngOnDestroy() {}

  cargarInventario() {
    this.service.cargarInventario().then((repuestos) => {
      this.source.load(repuestos);
    });
  }

  onDeleteConfirm(event: any) {
    const config = {
      title: 'Eliminar Repuesto',
      body: `Estas seguro que quieres eliminar el repuesto ${event.data.nombre}`,
      icon: 'exclamation',
    };
    this.modalService.showConfirmationModal(config).then((res) => {
      if (res) {
        this.service
          .eliminarRepuestoInventario(event.data.id)
          .then((res) =>
            res ? event.confirm.resolve() : event.confirm.reject()
          );
      }
    });
  }

  onCreateConfirm(event: any) {
    this.service
      .agregarRepuestoInventario(
        event.newData.nombre,
        event.newData.barrio,
        Number(event.newData.telefono)
      )
      .then((res) => {
        if (res) {
          event.confirm.resolve();
          this.cargarInventario();
        } else {
          event.confirm.reject();
        }
      });
  }

  onEditConfirm(event: any) {
    const costo = Number(event.newData.costo);
    if (isNaN(costo) || costo < 0 || costo > 99999) {
      this.alertService.showErrorToast("Error", "El campo costo debe ser un numero entre 0 y 99999")
    } else {
      this.service
        .editarRepuestoInventario(
          event.newData.id,
          event.newData.nombre,
          Number(event.newData.costo),
          Number(event.newData.stock)
        )
        .then((res) => {
          if (res) {
            event.confirm.resolve();
            this.cargarInventario();
          } else {
            event.confirm.reject();
          }
        });
    }
  }

  onUserRowSelect(event: any) {
    this.router.navigateByUrl(
      `pages/inventario/detalle/${event.data.id}`
    );
  }

  nuevoRepuesto() {
    this.dialogService
      .open(NuevoRepuestoModalComponent)
      .onClose.pipe(take(1))
      .toPromise()
      .then((res) => {
        if (res) {
          this.cargarInventario();
        }
      });
  }
}
