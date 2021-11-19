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
  selector: 'ngx-nuevo-reparacion',
  templateUrl: './nuevo-reparacion.component.html',
  styleUrls: ['./nuevo-reparacion.component.scss'],
})
export class NuevoReparacionComponent {
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
      cantidad: {
        title: 'Cantidad',
        type: 'text',
        filter: false,
      },
    },
  };

  loading = false;
  source: LocalDataSource = new LocalDataSource();
  unidades = [];
  tipoReparacionAEditar;
  descripcion = '';
  modoEdicion = false;
  content = '';
  costoTotalRepuestos = 0;

  constructor(
    private formBuilder: FormBuilder,
    private service: TipoReparacionService,
    private route: ActivatedRoute,
    private router: Router,
    private inventarioService: InventarioService,
    private modalService: ModalService,
    private dialogService: NbDialogService
  ) {}

  nuevoForm: FormGroup = this.formBuilder.group({
    nombre: [
      '',
      [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern("[a-zA-Z0-9 ,']*"),
      ],
    ],
    tiempoEstimadoMedida: 'horas',
    tiempoEstimadoUnidad: [0, [Validators.pattern('[0-9]')]],
    costoMano: [
      '0',
      [
        Validators.required,
        Validators.maxLength(5),
        Validators.pattern('([0-9]+.?[0-9]*|.[0-9]+)'),
      ],
    ],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // traer el objeto con ese id y patchear el form
      this.service.getTipoReparacion(id).then((tipoReparacion) => {
        this.tipoReparacionAEditar = tipoReparacion;
        this.nuevoForm.patchValue({
          nombre: tipoReparacion.get('nombre'),
          tiempoEstimadoUnidad: tipoReparacion
            .get('tiempoEstimado')
            .split(' ')[0],
          tiempoEstimadoMedida: tipoReparacion
            .get('tiempoEstimado')
            .split(' ')[2],
        });

        this.unidades = tipoReparacion.repuestosFetched.map((unidad) => {
          return {
            id: unidad.id,
            repuesto: unidad.get('repuesto'),
            cantidad: unidad.get('cantidad'),
            nombre: unidad.get('repuesto').get('nombre'),
          };
        });

        this.calcularCostoTotalRepuesto();

        this.content = tipoReparacion.get('descripcion');
        this.descripcion = tipoReparacion.get('descripcion');

        this.source.load(this.unidades);
        this.modoEdicion = true;
      });
    }
  }

  ngOnDestroy() {}

  calcularCostoTotalRepuesto() {
    this.costoTotalRepuestos = 0;
    this.unidades.forEach((unidad) => {
      this.costoTotalRepuestos = unidad.repuesto.get('costo') * unidad.cantidad;
    });
  }

  // Dispara el modal y luego agrega el repuesto agregado a la lista
  nuevoRepuesto() {
    this.dialogService
      .open(NuevoRepuestoUnidadModalComponent, {
        context: {
          addedRepuestoUnidades: this.unidades,
        },
      })
      .onClose.pipe(take(1))
      .toPromise()
      .then((res) => {
        if (res) {
          this.unidades.push(res);
          this.calcularCostoTotalRepuesto();
          this.source.load(this.unidades);
        }
      });
  }

  goBack() {
    this.router.navigateByUrl(`pages/tipo-reparaciones`);
  }

  confirm() {
    if (!this.loading) {
      this.loading = true;

      const tiempoEstimado = `${
        this.nuevoForm.get('tiempoEstimadoUnidad').value
      }  ${this.nuevoForm.get('tiempoEstimadoMedida').value}`;

      if (!this.modoEdicion) {
        this.service
          .agregarTipoReparacion(
            this.nuevoForm.get('nombre').value,
            this.descripcion,
            tiempoEstimado,
            this.unidades,
            Number(this.nuevoForm.get('costoMano').value) || 0,
            this.costoTotalRepuestos
          )
          .then((res) => this.router.navigateByUrl(`pages/tipo-reparaciones`))
          .finally(() => {
            this.loading = false;
          });
      } else {
        this.service
          .editarTipoReparacion(
            this.nuevoForm.get('nombre').value,
            this.descripcion,
            tiempoEstimado,
            this.unidades,
            Number(this.nuevoForm.get('costoMano').value) || 0,
            this.tipoReparacionAEditar,
            this.costoTotalRepuestos
          )
          .then((res) => this.router.navigateByUrl(`pages/tipo-reparaciones`))
          .finally(() => {
            this.loading = false;
          });
      }
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
        body: `¿Seguro que quieres quitar la unidad ${event.data.nombre} para este tipo de reparacion?`,
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
    this.calcularCostoTotalRepuesto();
  }
}
