import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../reportes.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ngx-repuestos-mas-utilizados',
  styleUrls: ['./repuestos-mas-utilizados.component.scss'],
  templateUrl: './repuestos-mas-utilizados.component.html',
})
export class ReporteRepuestoMasUtilizadoComponent implements OnInit{
  constructor(private service: ReportesService, private formBuilder: FormBuilder, private router: Router) {}

  data = [];
  dataMes = [];
  loading = true;

  dateForm: FormGroup = this.formBuilder.group({
    desde: '',
    hasta: '',
  })

  sourceRepuesto: LocalDataSource = new LocalDataSource();
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
      editButtonContent: '<i class="nb-search" data-toggle="tooltip" title="Ir al historial"></i>',
    },
    columns: {
      nombre: {
        title: 'Repuesto',
        type: 'text',
      },
      cantidad: {
        title: 'Cantidad',
        type: 'number',
      },
    },
  };

  ngOnInit() {
    this.cargarData();

    this.dateForm.valueChanges.subscribe(val => {
      this.loading = true;
      this.service.repuestosMasUtilizados(val.desde, val.hasta).then(res => {
        this.sourceRepuesto.load(res);
        this.data = res;
        this.loading = false;
      });
    });
  }

  cargarData(){
    this.loading = true;
    this.service.repuestosMasUtilizados().then(res => {
      this.sourceRepuesto.load(res);
      this.data = res;
      this.loading = false;
    });
  }

  clearSearch() {
    this.dateForm.reset();
    this.cargarData();
  }

  onEditIngresos(event) {
    this.router.navigateByUrl(`pages/inventario/detalle/${event.data.id}`);
  }

  print(){
    window.print();
  }
}
