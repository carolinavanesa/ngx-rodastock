import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../reportes.service';
import { FormControl, FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-ingresos-mensuales',
  styleUrls: ['./ingresos-mensuales.component.scss'],
  templateUrl: './ingresos-mensuales.component.html',
})
export class ReporteIngresosMensualesComponent implements OnInit{
  constructor(private service: ReportesService, private formBuilder: FormBuilder, private router: Router) {}

  data = [];
  periodo = new FormControl();
  periodoOptions = [];
  loading = true;
  total = 0;

  // dateForm = this.formBuilder.group({
  //   periodo: [new Date().getFullYear()],
  // });

  dateForm = this.formBuilder.group({
    desde: '',
    hasta: '',
  })

  sourceIngreso: LocalDataSource = new LocalDataSource();
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
      editButtonContent: '<i class="nb-compose"></i>',
    },
    columns: {
      fecha: {
        title: 'Fecha',
        type: 'text',
        sort: false,
      },
      cliente: {
        title: 'Cliente',
        type: 'text',
      },
      pedido: {
        title: 'Pedido Nº',
        type: 'text',
      },
      rodado: {
        title: 'Rodado',
        type: 'text',
      },
      reparacion: {
        title: 'Reparacion',
        type: 'text',
      },
      importe: {
        title: 'Ingreso $',
        type: 'number',
      },
    },
  };

  ngOnInit() {
    this.cargarData();

    // const year = new Date().getFullYear();
    // for (let i = 0; i < 5; i++) {
    //   this.periodoOptions.push(year-i);
    // }

    this.dateForm.valueChanges.subscribe(val => {
      this.loading = true;
      this.service.ingresosMensualesReparaciones(val.desde, val.hasta).then(res => {
        this.sourceIngreso.load(res);
        this.data = this.mapBars(res);
        this.loading = false;
      });
    });
  }

  mapBars(data: any[]){
    const result = [];
    this.total = 0;

    data.forEach(x => {
      const existente = result.find(r => r.fecha === x.fecha);

      if (existente) {
        existente.total += x.importe;
      } else {
        result.push({ total: x.importe, ...x })
      }

      this.total += x.importe;
    });

    return result;
  }

  clearSearch() {
    this.dateForm.reset();
    this.cargarData();
  }

  cargarData(){
    this.loading = true;
    this.service.ingresosMensualesReparaciones().then(res => {
      this.sourceIngreso.load(res);
      this.data = this.mapBars(res);
      this.loading = false;
    });
  }

  onEditIngresos(event) {
    this.router.navigateByUrl(`pages/ordenes/detalle-orden/${event.data.id}`);
  }

  print(){
    window.print();
  }
}
