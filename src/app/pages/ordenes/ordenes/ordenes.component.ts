import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrdenesService } from '../ordenes.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { EstadosModalComponent } from '../estados-modal/estados-modal.component';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./ordenes.component.scss'],
  templateUrl: './ordenes.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class OrdenesComponent implements OnInit {
  searchText = '';
  estadoFormControl = new FormControl('Todos');
  ordenesTotal = 0;
  ordenes = [];
  ordenesFull = [];
  ordenesEntrega = [];
  ordenesAtrasados = [];
  isLista = false;


  dateForm: FormGroup = this.formBuilder.group({
    desde: '',
    hasta: '',
  })

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
      cliente: {
        title: 'Cliente',
        type: 'text',
      },
      telefono: {
        title: 'Telefono',
        type: 'text',
      },
      rodado: {
        title: 'Rodado',
        type: 'text',
      },
      importe: {
        title: 'Importe $',
        type: 'number',
      },
      fechaEntrega: {
        title: 'Fecha Entrega',
        type: 'text',
      },
    },
  };

  constructor(
    private service: OrdenesService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dialogService: NbDialogService,
  ) {}

  ngOnInit() {
    this.cargarOrdenes();

    const search = this.route.snapshot.paramMap.get('search');
    if (search) {
      this.searchText = search;
    }

    this.estadoFormControl.valueChanges.subscribe(val => {
      if (val && val !== 'Todos') {
        this.ordenes = this.ordenesFull.filter(x => x.estado === val);
      } else {
        this.ordenes = this.ordenesFull;
      }
      this.cargarTabla(this.ordenes);
    });

    this.dateForm.valueChanges.subscribe(val => {
      this.service.cargarOrdenes(val.desde, val.hasta).then(ordenes => {
        this.ordenes = ordenes;
        this.ordenesFull = [...ordenes];
        this.cargarTabla(this.ordenes);
      });
    });
  }

  clearSearch() {
    this.searchText = '';
  }

  clearDateSearch() {
    this.cargarOrdenes();
    this.dateForm.reset();
  }

  cargarOrdenes() {
    this.service.cargarOrdenes().then((ordenes) => {
      this.ordenesTotal = ordenes.length;
      this.ordenes = ordenes;
      this.ordenesFull = [...ordenes];
      this.ordenesEntrega = this.ordenes.filter(o => isToday(o.fechaEntrega) && o.estado !== 'Cancelado' && o.estado !== 'Entregado');
      this.ordenesAtrasados = this.ordenes.filter(o => (o.estado === 'Pendiente' || o.estado === 'En Curso') && this.menorFecha(o.fechaEntrega));

      this.cargarTabla(ordenes);
    });
  }

  cargarTabla(ordenes: any[]) {
    this.sourceLista.load(ordenes.map(o => ({
      numero: o.numero,
        cliente: o.cliente.get('nombre'),
        telefono: o.cliente.get('telefono'),
        rodado: o.rodado,
        fecha: this.datePipe.transform(o.fecha, 'dd/MM/yyyy'),
        importe: o.importe,
        fechaEntrega: this.datePipe.transform(o.fechaEntrega, 'dd/MM/yyyy'),
        result: o,
    })));
  }


  menorFecha(fecha: Date) {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    fecha.setHours(0);
    fecha.setMinutes(0);
    fecha.setSeconds(0);
    fecha.setMilliseconds(0);

    return fecha.getTime() < today.getTime();
  }

  nuevaOrden() {
    this.router.navigateByUrl(`pages/ordenes/nueva-orden`);
  }

  openEstadoModal(event: any){
    const orden = event.data.result;
    this.dialogService
      .open(EstadosModalComponent, {
        context: {
          estado: orden.estado,
          orden: orden.orden,
          calificacion: orden.calificacion,
          reparaciones: orden.reparaciones,
        },
      })
      .onClose.pipe(take(1))
      .toPromise()
      .then((res) => {
        if (res) {
          this.cargarOrdenes();
        }
      });
  }
}

const isToday = (someDate) => {
  const today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}
