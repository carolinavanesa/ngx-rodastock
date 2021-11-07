import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { take } from 'rxjs/operators';
import { ModalService } from '../../../shared/modal/modal.service';
import { InventarioService } from '../../inventario/inventario.service';
import { OrdenesService } from '../ordenes.service';
import { TipoReparacionService } from '../../tipo-reparaciones/tipo-reparaciones.service';
import { ClientesService } from '../../clientes/clientes.service';
import { MatSelect } from '@angular/material/select';
import { AlertService } from '../../../shared/alert.service';
import { AgregarReparacionModalComponent } from '../agregar-reparacion-modal/agregar-reparacion-modal.component';

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
      costoMano: {
        title: 'Costo de Mano',
        type: 'text',
        filter: false,
      },
      costoRepuestos: {
        title: 'Costo de Repuestos',
        type: 'text',
        filter: false,
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  reparaciones = [];
  ordenAEditar;
  numeroOrdenSiguiente = '0';
  modoEdicion = false;
  // costoTotal = 0;
  costoTotalRepuestos = 0;
  costoTotalMano = 0;
  clienteOptions = [];
  tipoReparacionesOptions = [];
  costoAdicional = 0;

  fileToUpload: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private service: OrdenesService,
    private tipoReparacionService: TipoReparacionService,
    private clienteService: ClientesService,
    private route: ActivatedRoute,
    private router: Router,
    private inventarioService: InventarioService,
    private modalService: ModalService,
    private alertService: AlertService,
    private dialogService: NbDialogService
  ) {}

  nuevoForm: FormGroup = this.formBuilder.group({
    observaciones: '',
    cliente: '',
    rodado: '',
    costoAdicional: 0,
    fecha: new Date(),
    fechaEntrega: new Date(),
    telefono: '',
    entregaInicial: 0,
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
      this.service.getSiguienteNumeroOrden().then((numero) => {
        this.numeroOrdenSiguiente = numero;
      });
    }

    // Necesarias para cargar la orden
    this.clienteService
      .cargarClientes()
      .then((clientes) => (this.clienteOptions = clientes));
    this.tipoReparacionService
      .cargarTipoReparacion()
      .then(
        (tipoReparaciones) => (this.tipoReparacionesOptions = tipoReparaciones)
      );
  }

  ngOnDestroy() {}

  calcularCostoTotalReparaciones() {
    this.costoTotalRepuestos = 0;
    this.costoTotalMano = 0;
    this.reparaciones.forEach((reparacion) => {
      this.costoTotalRepuestos += reparacion.costoRepuestos;
      this.costoTotalMano += reparacion.costoMano;
    });
  }

  calcularTiempoEstimadoTarea() {
    let cantidadHoras = 0;
    let cantidadDias = 0
    this.reparaciones.forEach((reparacion) => {
      const medida = reparacion.get('tiempoEstimado').split(' ')[1];
      const cantidad = reparacion.get('tiempoEstimado').split(' ')[0];
      if (medida === 'horas') {
        cantidadHoras += Number(cantidad);
      } else {
        cantidadDias += Number(cantidadDias);
      }
    });

    if (cantidadHoras > 8) {
      cantidadDias++;
    }

    if (cantidadDias > 0) {
      return new Date()
    } else {

    }

  }

  calcularCostoTotalOrden(){
    return this.costoTotalRepuestos + this.costoTotalMano + Number(this.nuevoForm.get('costoAdicional').value);
  }

  onClienteChange(event: MatSelect) {
    const telefono =
      this.clienteOptions.find((c) => c.id === event.value)?.telefono || '-';
    this.nuevoForm.get('telefono').setValue(telefono);
  }

  handleFileInput(files: FileList) {
    if (files.item(0).type.substr(0,5) != 'image') {
      this.alertService.showErrorToast(
        'Error',
        'Solo puede subir archivos de tipo imagen'
      );
      // TODO: vaciar files cuando hay error
    } else {
      this.fileToUpload = files.item(0);
    }
  }

  // Dispara el modal y luego agrega la reparacion a la lista
  agregarReparacion() {
    this.dialogService
      .open(AgregarReparacionModalComponent, {
        context: {
          addedReparaciones: this.reparaciones,
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
    if (!this.modoEdicion) {
      // this.service
      //   .agregarOrden(
      //     this.nuevoForm.get('nombre').value,
      //     this.descripcion,
      //     tiempoEstimado,
      //     this.reparaciones,
      //     this.nuevoForm.get('costoMano').value || 0,
      //   )
      //   .then((res) => this.router.navigateByUrl(`pages/ordenes`));
    } else {
      // this.service
      //   .editarOrden(
      //     this.nuevoForm.get('nombre').value,
      //     this.descripcion,
      //     tiempoEstimado,
      //     this.reparaciones,
      //     this.nuevoForm.get('costoMano').value || 0,
      //     this.ordenAEditar
      //   )
      //   .then((res) => this.router.navigateByUrl(`pages/ordenes`));
    }
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
