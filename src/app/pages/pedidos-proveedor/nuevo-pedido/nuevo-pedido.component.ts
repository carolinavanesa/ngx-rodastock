import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { take } from 'rxjs/operators';
import { ModalService } from '../../../shared/modal/modal.service';
import { InventarioService } from '../../inventario/inventario.service';
import { PedidosProveedorService } from '../pedidos-proveedor.service';
import { NuevoRepuestoUnidadModalComponent } from '../../tipo-reparaciones/nuevo-repuesto-unidad-modal/nuevo-repuesto-unidad-modal.component';
import { ProveedoresService } from '../../proveedores/proveedores.service';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'ngx-nuevo-pedido',
  templateUrl: './nuevo-pedido.component.html',
  styleUrls: ['./nuevo-pedido.component.scss'],
})
export class NuevoPedidoComponent {
  settings = {
    noDataMessage: 'No hay resultados',
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
      deleteButtonContent: '<i class="nb-trash" data-toggle="tooltip" title="Quitar repuesto"></i>',
      confirmDelete: true,
    },
    columns: {
      // id: {
      //   title: 'ID',
      //   type: 'text',
      //   hide: true,
      //   editable: false,
      //   filter: false,
      // },
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
  pedidoAEditar;
  descripcion = '';
  modoEdicion = false;
  proveedorOptions = [];
  content = '';
  costoTotalRepuestos = 0;
  estadoOptions = ['Pendiente', 'En curso', 'Entregado'];

  constructor(
    private formBuilder: FormBuilder,
    private service: PedidosProveedorService,
    private route: ActivatedRoute,
    private router: Router,
    private proveedorService: ProveedoresService,
    private inventarioService: InventarioService,
    private modalService: ModalService,
    private dialogService: NbDialogService
  ) {}

  nuevoForm: FormGroup = this.formBuilder.group({
    numero: [
      '',
      [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern('[0-9]*'),
      ],
    ],
    proveedor: [
      '',
      [
        Validators.required,
      ],
    ],
    notas: [
      '',
      [Validators.maxLength(200), Validators.pattern("[a-zA-Z0-9ñº# ,']*")],
    ],
    fecha: [new Date(), [Validators.required]],
    monto: [
      '',
      [
        Validators.required,
        Validators.maxLength(5),
        Validators.pattern('([0-9]+.?[0-9]*|.[0-9]+)'),
      ],
    ],
    estado: ['Pendiente', [Validators.required]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // traer el objeto con ese id y patchear el form
      this.service.getPedidoProveedor(id).then((pedido) => {
        this.pedidoAEditar = pedido;
        this.nuevoForm.patchValue({
          numero: pedido.get('numero'),
          proveedor: pedido.get('proveedor'),
          notas: pedido.get('notas'),
          fecha: pedido.get('fecha'),
        });

        this.unidades = pedido.repuestosFetched.map((unidad) => {
          return {
            id: unidad.id,
            repuesto: unidad.get('repuesto'),
            cantidad: unidad.get('cantidad'),
            nombre: unidad.get('repuesto').get('nombre'),
          };
        });

        this.calcularCostoTotalRepuesto();

        this.source.load(this.unidades);
        this.modoEdicion = true;
      });
    }

    this.proveedorService
      .cargarProveedores()
      .then((proveedors) => (this.proveedorOptions = proveedors));

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
    this.router.navigateByUrl(`pages/pedidos-proveedor`);
  }

  confirm() {
    if (!this.loading) {
      this.loading = true;

      const proveedor = this.proveedorOptions.find(
        (c) => c.id === this.nuevoForm.get('proveedor').value
      );

      if (!this.modoEdicion) {
        this.service
          .agregarPedidoProveedor(
            Number(this.nuevoForm.get('numero').value),
            proveedor.proveedor,
            this.nuevoForm.get('fecha').value,
            this.unidades,
            this.nuevoForm.get('notas').value,
            Number(this.nuevoForm.get('monto').value),
            this.nuevoForm.get('estado').value
          )
          .then((res) => this.router.navigateByUrl(`pages/pedidos-proveedor`))
          .finally(() => {
            this.loading = false;
          });
      } else {
        // this.service
        //   .editarTipoReparacion(
        //     this.nuevoForm.get('nombre').value,
        //     this.descripcion,
        //     tiempoEstimado,
        //     this.unidades,
        //     Number(this.nuevoForm.get('costoMano').value) || 0,
        //     this.pedidoAEditar,
        //     this.costoTotalRepuestos
        //   )
        //   .then((res) => this.router.navigateByUrl(`pages/tipo-reparaciones`))
        //   .finally(() => {
        //     this.loading = false;
        //   });
      }
    }
  }

  // onProveedorChange(event: MatSelect) {
  //   const telefono =
  //     this.proveedorOptions.find((c) => c.id === event.value)?.telefono || '';
  // }


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
