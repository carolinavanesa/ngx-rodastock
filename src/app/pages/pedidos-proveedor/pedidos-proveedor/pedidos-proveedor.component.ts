import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidosProveedorService } from '../pedidos-proveedor.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import { EstadosModalComponent } from '../../ordenes/estados-modal/estados-modal.component';
import { take } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { EstadosPedidosModalComponent } from '../estados-pedidos-modal/estados-pedidos-modal.component';

@Component({
  templateUrl: './pedidos-proveedor.component.html',
  styleUrls: ['./pedidos-proveedor.component.scss'],
})
export class PedidosProveedorComponent implements OnInit {
  searchText = '';
  pedidos = [];
  pedidosFull = [];
  estadoFormControl = new FormControl('Todos');
  dateForm: FormGroup = this.formBuilder.group({
    desde: '',
    hasta: '',
  });

  isLista = false;

  sourceLista: LocalDataSource = new LocalDataSource();
  settings = {
    mode: 'external',
    actions: {
      add: false,
      delete: false,
      columnTitle: '',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    columns: {
      fecha: {
        title: 'Fecha',
        type: 'text',
      },
      numero: {
        title: 'Pedido Nº',
        type: 'text',
      },
      proveedor: {
        title: 'Proveedor',
        type: 'text',
      },
      telefono: {
        title: 'Telefono',
        type: 'text',
      },
      notas: {
        title: 'Notas',
        type: 'text',
      },
      importe: {
        title: 'Importe $',
        type: 'number',
      },
      estado: {
        title: 'Estado',
        type: 'text',
      },

    },
  };

  constructor(
    private service: PedidosProveedorService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialogService: NbDialogService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit() {
    this.cargarPedidoProveedor();

    this.estadoFormControl.valueChanges.subscribe(val => {
      if (val && val !== 'Todos') {
        this.pedidos = this.pedidosFull.filter(x => x.estado === val);
      } else {
        this.pedidos = this.pedidosFull;
      }
      this.cargarTabla(this.pedidos);
    });

    this.dateForm.valueChanges.subscribe(val => {
      this.service.cargarPedidoProveedor(val.desde, val.hasta).then(pedidos => {
        this.pedidos = pedidos;
        this.pedidosFull = [...pedidos];
        this.cargarTabla(this.pedidos);
      });
    });
  }

  clearDateSearch() {
    this.cargarPedidoProveedor();
    this.dateForm.reset();
  }

  cargarPedidoProveedor() {
    this.service.cargarPedidoProveedor().then((pedidos) => {
      this.pedidos = pedidos;
      this.pedidosFull = [...pedidos];
      this.cargarTabla(pedidos);
    });
  }

  cargarTabla(pedidos: any[]) {
    this.sourceLista.load(pedidos.map(o => ({
      numero: o.numero,
      proveedor: o.proveedor.get('nombre'),
      telefono: o.proveedor.get('telefono'),
      estado: o.estado,
      notas: o.notas,
      fecha: this.datePipe.transform(o.fecha, 'dd/MM/yyyy'),
      importe: o.monto,
      result: o,
    })));
  }

  nuevoPedido() {
    this.router.navigateByUrl(`pages/pedidos-proveedor/nuevo`);
  }

  clearSearch() {
    this.searchText = '';
  }

  openEstadoModal(event: any){
    const pedido = event.data.result;
    this.dialogService
      .open(EstadosPedidosModalComponent, {
        context: {
          estado: pedido.estado,
          pedido: pedido.pedido,
          repuestos: pedido.repuestos
        },
      })
      .onClose.pipe(take(1))
      .toPromise()
      .then((res) => {
        if (res) {
          this.cargarPedidoProveedor();
        }
      });
  }
}
