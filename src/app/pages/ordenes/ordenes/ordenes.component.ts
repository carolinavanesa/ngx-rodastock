import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrdenesService } from '../ordenes.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

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

  dateForm: FormGroup = this.formBuilder.group({
    desde: '',
    hasta: '',
  })

  constructor(
    private service: OrdenesService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
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
    });

    this.dateForm.valueChanges.subscribe(val => {
      this.service.cargarOrdenes(val.desde, val.hasta).then(ordenes => {
        this.ordenes = ordenes;
        this.ordenesFull = [...ordenes];
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
    });
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
}

const isToday = (someDate) => {
  const today = new Date()
  return someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}
