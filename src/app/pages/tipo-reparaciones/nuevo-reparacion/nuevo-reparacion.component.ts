import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { take } from 'rxjs/operators';
import { ModalService } from '../../../shared/modal/modal.service';
import { InventarioService } from '../../inventario/inventario.service';
import { NuevoRepuestoUnidadModalComponent } from '../nuevo-repuesto-unidad-modal/nuevo-repuesto-unidad-modal.component';
import { TipoReparacionService } from '../tipo-reparaciones.service';

@Component({
  selector: 'ngx-nuevo-reparacion-modal',
  templateUrl: './nuevo-reparacion.component.html',
  styleUrls: ['./nuevo-reparacion.component.scss'],
})
export class NuevoReparacionComponent {
  settings = {
    actions: {
      add: false,
      edit: false,
      columnTitle: ''
    },
    add: {
      confirmCreate: true,
    },
    edit: {
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
        filter: false,
      },
      nombre: {
        title: 'Nombre',
        type: 'text',
        filter: false,
      },
      cantidad: {
        title: 'Cantidad',
        type: 'text',
        filter: false,
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  unidades = [];
  descripcion = "";

  constructor(
    private formBuilder: FormBuilder,
    private service: TipoReparacionService,
    private route: ActivatedRoute,
    private router: Router,
    private inventarioService: InventarioService,
    private modalService: ModalService,
    private dialogService: NbDialogService,
  ) {}

  nuevoForm: FormGroup = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.maxLength(30), Validators.pattern("[a-zA-Z0-9 ,']*")]],
    tiempoEstimadoMedida: 'horas',
    tiempoEstimadoUnidad: [0, [Validators.pattern('[0-9]')]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // traer el objeto con ese id y patchear el form
      // this.service.cargarUnidad().then((Unidades) => {
      //   this.source.load(Unidades);
      // });
    }
  }

  ngOnDestroy() {}

  // Dispara el modal y luego agrega el repuesto agregado a la lista
  nuevoRepuesto() {
    this.dialogService
      .open(NuevoRepuestoUnidadModalComponent)
      .onClose.pipe(take(1))
      .toPromise()
      .then((res) => {
        if (res) {
          this.unidades.push(res);
          this.source.load(this.unidades);
        }
      });
  }

  goBack() {
    this.router.navigateByUrl(`pages/tipo-reparaciones`);
  }

  confirm() {
    const tiempoEstimado = `${this.nuevoForm.get('tiempoEstimadoUnidad').value}  ${this.nuevoForm.get('tiempoEstimadoMedida').value}`

    this.service
      .agregarTipoReparacion(
        this.nuevoForm.get('nombre').value,
        this.descripcion,
        tiempoEstimado,
        this.unidades
      )
      // .then((res) => this.ref.close(true))
      // .catch((e) => this.ref.close(false));
  }

  updateDescripcion(event) {
    this.descripcion = event;
  }

  onDeleteConfirm(event: any) {
    const config = {
      title: 'Eliminar Tipo de Reparacion',
      body: `Estas seguro que quieres eliminar el tipo de reparacion ${event.data.nombre}`,
      icon: 'exclamation',
    };
    this.modalService.showConfirmationModal(config).then((res) => {
      if (res) {
        event.confirm.resolve();
        // this.service
        //   .eliminarTipoReparacion(event.data.id)
        //   .then((res) =>
        //     res ? event.confirm.resolve() : event.confirm.reject()
        //   );
      }
    });
  }

  onCreateConfirm(event: any) {
    // this.service
    //   .agregarTipoReparacion(
    //     event.newData.nombre,
    //     event.newData.descripcion,
    //     event.newData.tiempoEstimado
    //   )
    //   .then((res) => {
    //     if (res) {
    //       event.confirm.resolve();
    //     } else {
    //       event.confirm.reject();
    //     }
    //   });
  }

  onEditConfirm(event: any) {
    // this.service
    //   .editarTipoReparacion(
    //     event.newData.id,
    //     event.newData.nombre,
    //     event.newData.descripcion,
    //     event.newData.tiempoEstimado
    //   )
    //   .then((res) => {
    //     if (res) {
    //       event.confirm.resolve();
    //       this.cargarTipoReparacion();
    //     } else {
    //       event.confirm.reject();
    //     }
    //   });
    this.router.navigateByUrl(`pages/tipo-reparaciones/repuesto/${event.data.id}`);
  }



}
