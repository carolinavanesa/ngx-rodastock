import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InventarioService } from '../inventario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePipe } from '@angular/common';
import { NuevoRepuestoModalComponent } from '../nuevo-repuesto-modal/nuevo-repuesto-modal.component';
import { take } from 'rxjs/operators';
import { Location } from '@angular/common'
import { NbDialogService } from '@nebular/theme';


@Component({
  selector: 'ngx-detalle-repuesto',
  templateUrl: './detalle-repuesto.component.html',
  styleUrls: ['./detalle-repuesto.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class DetalleRepuestoComponent implements OnInit {
  constructor(
    private service: InventarioService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    private dialogService: NbDialogService,
    private location: Location,
    // private location: Location,
  ) {}

  meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  settings = {
    mode: 'external',
    sort: false,
    actions: {
      add: false,
      delete: false,
      columnTitle: '',
    },
    edit: {
      editButtonContent: '<i class="nb-compose"></i>',
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

  ingresosChart = [ ];
  egresosChart = [ ];

  // listaIngresos = [];
  // listaEgresos = [];
  // inicial: any;

  ngOnInit(){
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getRepuestoInventario(id).then((repuesto) => {
        this.repuesto = repuesto;

        this.service.cargarActualizacionStock().then((actualizaciones) => {
          let listaIngresos = this.mapRows(actualizaciones.filter(act => act.get('repuesto').id === repuesto.id &&  act.get('tipo') === 'ingreso'), 'ingreso');
          const listaEgresos = this.mapRows(actualizaciones.filter(act => act.get('repuesto').id === repuesto.id && act.get('tipo') === 'egreso'), 'egreso');
          const inicial = this.mapRows([actualizaciones.find(act => act.get('repuesto').id === repuesto.id && act.get('tipo') === 'inicial')], '');

          listaIngresos = [...listaIngresos, ...inicial];

          this.ingresosChart = listaIngresos;
          this.egresosChart = listaEgresos;

          this.sourceIngreso.load([...listaIngresos, ...inicial]);
          this.sourceEgreso.load(listaEgresos);
        })
      });
    }
  }

  goBack() {
    this.location.back();
  }

  print(){
    window.print();
  }

  onEditIngresos(event) {
    this.router.navigateByUrl(`pages/pedidos-proveedor/detalle/${event.data.id}`);
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

  mapRows(lista: any[], tipo: string){
    return lista.map(r => {
      return {
        id: tipo == 'ingreso' ? r.get('pedidoIngreso').id : r.get('pedidoEgreso')?.id,
        fecha: this.datePipe.transform(r.get('createdAt'), 'dd/MM/yyyy'),
        cantidad: r.get('cantidad'),
        stockPrevio: r.get('stockPrevio'),
        stockSiguiente: tipo == 'ingreso' ? (r.get('cantidad') + r.get('stockPrevio')) : tipo == 'egreso' ? (r.get('stockPrevio') - r.get('cantidad')) : r.get('cantidad'),
        stock: r.get('cantidad'),
        pedido: r.get('pedidoIngreso')?.get('numero') || r.get('pedidoEgreso')?.get('numero')|| 'Stock inicial',
      }
    })
  }
}
