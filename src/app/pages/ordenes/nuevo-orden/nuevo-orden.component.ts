import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { take } from 'rxjs/operators';
import { ModalService } from '../../../shared/modal/modal.service';
import { InventarioService } from '../../inventario/inventario.service';
import { NuevoRepuestoUnidadModalComponent } from '../nuevo-repuesto-unidad-modal/nuevo-repuesto-unidad-modal.component';
import { OrdenesService } from '../ordenes.service';
import { TipoReparacionService } from '../../tipo-reparaciones/tipo-reparaciones.service';
import { ClientesService } from '../../clientes/clientes.service';

@Component({
  selector: 'ngx-nuevo-orden',
  templateUrl: './nuevo-orden.component.html',
  styleUrls: ['./nuevo-Orden.component.scss'],
})
export class NuevoOrdenComponent {
  settings = {
    actions: {
      add: false,
      edit: false,
      columnTitle: '',
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
    },
  };

  source: LocalDataSource = new LocalDataSource();
  reparaciones = [];
  ordenAEditar;
  numeroOrdenSiguiente = 0;
  modoEdicion = false;
  costoTotal = 0;
  clienteOptions = [];
  tipoReparacionesOptions = [];
  costoAdicional = 0;

  constructor(
    private formBuilder: FormBuilder,
    private service: OrdenesService,
    private tipoReparacionService: TipoReparacionService,
    private clienteService: ClientesService,
    private route: ActivatedRoute,
    private router: Router,
    private inventarioService: InventarioService,
    private modalService: ModalService,
    private dialogService: NbDialogService
  ) {}

  nuevoForm: FormGroup = this.formBuilder.group({
    // nombre: [
    //   '',
    //   [
    //     Validators.required,
    //     Validators.maxLength(30),
    //     Validators.pattern("[a-zA-Z0-9 ,']*"),
    //   ],
    // ],
    // tiempoEstimadoMedida: 'horas',
    // tiempoEstimadoUnidad: [0, [Validators.pattern('[0-9]')]],
    // costoMano: ['0', [Validators.required, Validators.maxLength(5), Validators.pattern('([0-9]+\.?[0-9]*|\.[0-9]+)')]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // traer el objeto con ese id y patchear el form
      this.service.getOrden(id).then((orden) => {
        this.ordenAEditar = orden;
        this.nuevoForm.patchValue({
          nombre: orden.get('nombre'),
        });

        this.reparaciones = orden.repuestosFetched.map((reparacion) => {
          return {
            id: reparacion.id,
            nombre: reparacion.get('nombre'),
            descripcion: reparacion.get('descripcion'),
            tiempoEstimado: reparacion.get('tiempoEstimado'),
            costoMano: reparacion.get('costoMano'),
          };
        });

        this.calcularCostoTotalReparaciones();
        this.source.load(this.reparaciones);
        this.modoEdicion = true;
      });
    } else {
      this.service.getOrden(id).then((numero) => {
        this.numeroOrdenSiguiente = numero;
      });
    }

    // Necesarias para cargar la orden
    this.clienteService.cargarClientes().then(clientes => this.clienteOptions = clientes);
    this.tipoReparacionService.cargarTipoReparacion().then(tipoReparaciones => this.tipoReparacionesOptions = tipoReparaciones);
  }

  ngOnDestroy() {}

  calcularCostoTotalReparaciones(){
    this.costoTotal = 0;
    this.reparaciones.forEach(reparacion => {
      this.costoTotal = reparacion.get('costoMano') + reparacion.get('costoReparacion')
    });
  }

  // Dispara el modal y luego agrega el repuesto agregado a la lista
  nuevoRepuesto() {
    this.dialogService
      .open(NuevoRepuestoUnidadModalComponent, {
        context: {
          addedRepuestoreparaciones: this.reparaciones,
        },
      })
      .onClose.pipe(take(1))
      .toPromise()
      .then((res) => {
        if (res) {
          this.reparaciones.push(res);
          this.calcularCostoTotalReparaciones();
          this.source.load(this.reparaciones);
        }
      });
  }

  goBack() {
    this.router.navigateByUrl(`pages/ordenes`);
  }

  confirm() {
    const tiempoEstimado = `${
      this.nuevoForm.get('tiempoEstimadoUnidad').value
    }  ${this.nuevoForm.get('tiempoEstimadoMedida').value}`;

    if (!this.modoEdicion) {
      this.service
        .agregarOrden(
          this.nuevoForm.get('nombre').value,
          this.descripcion,
          tiempoEstimado,
          this.reparaciones,
          this.nuevoForm.get('costoMano').value || 0,
        )
        .then((res) => this.router.navigateByUrl(`pages/ordenes`));
    } else {
      this.service
        .editarOrden(
          this.nuevoForm.get('nombre').value,
          this.descripcion,
          tiempoEstimado,
          this.reparaciones,
          this.nuevoForm.get('costoMano').value || 0,
          this.ordenAEditar
        )
        .then((res) => this.router.navigateByUrl(`pages/ordenes`));
    }
  }

  updateDescripcion(event) {
    this.descripcion = event;
  }

  onDeleteConfirm(event: any) {
    if (!event.data.id) {
      event.confirm.resolve();
    } else {
      const config = {
        title: 'Eliminar Repuesto',
        body: `¿Seguro que quieres quitar la unidad ${event.data.nombre} para este  de Orden?`,
        icon: 'exclamation',
      };
      this.modalService.showConfirmationModal(config).then((res) => {
        if (res) {
          this.inventarioService
            .eliminarRepuestoUnidad(event.data.id)
            .then((res) =>
              res ? event.confirm.resolve() : event.confirm.reject()
            );
        }
      });
    }
  }
}
