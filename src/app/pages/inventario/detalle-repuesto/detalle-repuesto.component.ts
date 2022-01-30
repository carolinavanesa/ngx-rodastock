import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InventarioService } from '../inventario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import { NuevoRepuestoModalComponent } from '../nuevo-repuesto-modal/nuevo-repuesto-modal.component';
import { take } from 'rxjs/operators';
import { Location } from '@angular/common';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-detalle-repuesto',
  templateUrl: './detalle-repuesto.component.html',
  styleUrls: ['./detalle-repuesto.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetalleRepuestoComponent implements OnInit {
  constructor(
    private service: InventarioService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    private dialogService: NbDialogService,
    private location: Location // private location: Location,
  ) {}

  meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  settings = {
    noDataMessage: 'No hay resultados',
    mode: 'external',
    sort: false,
    actions: {
      add: false,
      delete: false,
      columnTitle: '',
    },
    edit: {
      editButtonContent: '<i class="nb-compose" data-toggle="tooltip" title="Ir al detalle del pedido"></i>',
    },
    columns: {
      fecha: {
        title: 'Fecha',
        type: 'text',
      },
      cantidad: {
        title: 'Cantidad',
        type: 'text',
      },
      stockPrevio: {
        title: 'Stock Previo',
        type: 'text',
        editable: false,
      },
      stockSiguiente: {
        title: 'Stock Siguiente',
        type: 'text',
        editable: false,
      },
      pedido: {
        title: 'Pedido Nº',
        type: 'text',
        editable: false,
      },
    },
  };

  repuesto: any;
  sourceIngreso: LocalDataSource = new LocalDataSource();
  sourceEgreso: LocalDataSource = new LocalDataSource();

  sourceChartIngresos;
  sourceChartEgresos;

  ingresosChart = [];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getRepuestoInventario(id).then((repuesto) => {
        this.repuesto = repuesto;

        this.service.cargarActualizacionStock().then((actualizaciones) => {
          const actualizacionesRepuesto = actualizaciones.filter(
            (act) => act.get('repuesto').id === repuesto.id
          );

          let listaIngresos = this.mapRows(
            actualizacionesRepuesto.filter(
              (act) => act.get('tipo') === 'ingreso'
            ),
            'ingreso'
          );
          const listaEgresos = this.mapRows(
            actualizacionesRepuesto.filter(
              (act) => act.get('tipo') === 'egreso'
            ),
            'egreso'
          );
          const inicial = this.mapRows(
            [
              actualizacionesRepuesto.find(
                (act) => act.get('tipo') === 'inicial'
              ),
            ],
            ''
          );

          listaIngresos = [...listaIngresos, ...inicial];

          this.ingresosChart = listaIngresos;

          this.sourceIngreso.load(listaIngresos);
          this.sourceEgreso.load(listaEgresos);

          actualizacionesRepuesto.reverse().forEach((act, index) => {
            if (
              act.get('tipo') === 'inicial' ||
              act.get('tipo') === 'ingreso'
            ) {
              this.ingresosChart[index] = this.mapRows([act], 'ingreso')[0];
            } else {
              this.ingresosChart[index] = this.mapRows([act], 'egreso')[0];
            }
          });
        });
      });
    }
  }

  goBack() {
    this.location.back();
  }

  print() {
    window.print();
  }

  onEditIngresos(event) {
    this.router.navigateByUrl(
      `pages/pedidos-proveedor/detalle/${event.data.id}`
    );
  }
  onEditEgresos(event) {
    this.router.navigateByUrl(`pages/ordenes/detalle-orden/${event.data.id}`);
  }

  onEdit() {
    this.dialogService
      .open(NuevoRepuestoModalComponent, {
        context: {
          modoEdicion: true,
          repuesto: this.repuesto,
        },
      })
      .onClose.pipe(take(1))
      .toPromise()
      .then((res) => {
        if (res) {
          this.repuesto = res;
        }
      });
  }

  mapRows(lista: any[], tipo: string) {
    return lista.map((r) => {
      return {
        id:
          tipo == 'ingreso'
            ? r.get('pedidoIngreso')?.id
            : r.get('pedidoEgreso')?.id,
        fecha: this.datePipe.transform(r.get('createdAt'), 'dd/MM/yyyy'),
        cantidad: r.get('cantidad'),
        stockPrevio: r.get('stockPrevio'),
        stockSiguiente:
          tipo == 'ingreso'
            ? r.get('cantidad') + r.get('stockPrevio')
            : tipo == 'egreso'
            ? r.get('stockPrevio') - r.get('cantidad')
            : r.get('cantidad'),
        stock: r.get('cantidad'),
        pedido:
          r.get('pedidoIngreso')?.get('numero') ||
          r.get('pedidoEgreso')?.get('numero') ||
          'Stock inicial',
      };
    });
  }
}
