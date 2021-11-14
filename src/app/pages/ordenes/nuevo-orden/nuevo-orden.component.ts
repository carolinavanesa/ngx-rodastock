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
      tiempoEstimado: {
        title: 'Duracion',
        type: 'text',
        filter: false,
      },
      detalle: {
        title: 'Detalle Repuestos',
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
  numeroOrdenSiguiente = 0;
  modoEdicion = false;
  costoTotalRepuestos = 0;
  costoTotalMano = 0;
  clienteOptions = [];
  tipoReparacionesOptions = [];
  repuestoInventario = [];
  erroresDeStock = [];
  fileToUpload: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private service: OrdenesService,
    private tipoReparacionService: TipoReparacionService,
    private clienteService: ClientesService,
    private inventarioService: InventarioService,
    private router: Router,
    private alertService: AlertService,
    private dialogService: NbDialogService
  ) {}

  nuevoForm: FormGroup = this.formBuilder.group({
    observaciones: ['', [Validators.maxLength(100)]],
    cliente: ['', [Validators.required]],
    rodado: ['', [Validators.required, Validators.maxLength(50)]],
    fecha: [new Date(), [Validators.required]],
    fechaEntrega: [new Date(), [Validators.required]],
    telefono: ['', [Validators.required, Validators.pattern('[0-9 ()-]*')]],
    costoAdicional: [
      0,
      [
        Validators.maxLength(10),
        Validators.pattern('([0-9]+.?[0-9]*|.[0-9]+)'),
      ],
    ],
    entregaInicial: [
      0,
      [
        Validators.maxLength(10),
        Validators.pattern('([0-9]+.?[0-9]*|.[0-9]+)'),
      ],
    ],
  });

  ngOnInit(): void {
    this.service.getSiguienteNumeroOrden().then((numero) => {
      this.numeroOrdenSiguiente = Number(numero);
    });

    // Necesarias para cargar la orden
    this.clienteService
      .cargarClientes()
      .then((clientes) => (this.clienteOptions = clientes));
    this.tipoReparacionService
      .cargarTipoReparacion()
      .then(
        (tipoReparaciones) => (this.tipoReparacionesOptions = tipoReparaciones)
      );
    this.inventarioService
      .cargarInventario()
      .then((repuestos) => (this.repuestoInventario = repuestos));
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
    let cantidadDias = 0;
    this.reparaciones.forEach((reparacion) => {
      const medida = reparacion.tiempoEstimado.split(' ')[2];
      const cantidad = reparacion.tiempoEstimado.split(' ')[0];
      if (medida === 'horas') {
        cantidadHoras += Number(cantidad);
      } else {
        cantidadDias += Number(cantidad);
      }
    });

    if (cantidadHoras > 8) {
      cantidadDias++;
    }

    let today = new Date();
    if (cantidadDias > 0) {
      today.setDate(today.getDate() + cantidadDias);
    }

    return today;
  }

  calcularCostoTotalOrden() {
    return (
      this.costoTotalRepuestos +
      this.costoTotalMano +
      Number(this.nuevoForm.get('costoAdicional').value)
    );
  }

  onClienteChange(event: MatSelect) {
    const telefono =
      this.clienteOptions.find((c) => c.id === event.value)?.telefono || '';
    this.nuevoForm.get('telefono').setValue(telefono);
  }

  handleFileInput(files: FileList) {
    if (files.item(0).type.substr(0, 5) != 'image') {
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

          // Si no se establecio fecha de entrega cargar una fecha estimada por las reparaciones
          if (this.nuevoForm.get('fechaEntrega').pristine) {
            this.nuevoForm
              .get('fechaEntrega')
              .setValue(this.calcularTiempoEstimadoTarea());
          }

          // Comprobar si hay stock de las unidades necesarias para la reparacion
          this.comprobarStockReparacion(res);
        }
      });
  }

  comprobarStockReparacion(result: any) {
    this.tipoReparacionService
      .getTipoReparacion(result.id)
      .then((reparacion) => {
        let detalleRepuesto = '';
        reparacion.repuestosFetched.forEach((rep) => {
          const nombre = rep.get('repuesto')?.get('nombre');
          const stock = rep.get('repuesto')?.get('stock');
          const cantidad = rep.get('cantidad');
          if (stock < rep.get('cantidad')) {
            this.erroresDeStock.push({
              reparacion: reparacion.get('nombre'),
              repuesto: nombre,
              stock: stock,
              cantidad: cantidad,
            });
          }

          detalleRepuesto += nombre + ': ' + cantidad + ' , ';
        });
        result.detalle = detalleRepuesto;
        this.source.load(this.reparaciones);
      });
  }

  goBack() {
    this.router.navigateByUrl(`pages/ordenes`);
  }

  confirm() {
    const cliente = this.clienteOptions.find(
      (c) => c.id === this.nuevoForm.get('cliente').value
    );

    if (!this.modoEdicion) {
      this.service
        .agregarOrden(
          this.numeroOrdenSiguiente,
          this.nuevoForm.get('fecha').value,
          cliente.cliente,
          this.nuevoForm.get('telefono').value,
          this.nuevoForm.get('rodado').value,
          this.nuevoForm.get('observaciones').value,
          Number(this.nuevoForm.get('costoAdicional').value) || 0,
          this.nuevoForm.get('fechaEntrega').value,
          this.reparaciones.map((rep) => rep.reparacion),
          this.calcularCostoTotalOrden(),
          this.fileToUpload
        )
        .then((res) => this.router.navigateByUrl(`pages/ordenes`));
    } else {
      // TODO: Se puede editar una orden?
    }
  }

  onDeleteConfirm(event: any) {
    if (!event.data.id) {
      event.confirm.resolve();
    } else {
      // TODO: Se puede editar una orden?
    }
    this.calcularCostoTotalReparaciones;
  }
}
