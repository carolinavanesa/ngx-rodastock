import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../reportes.service';
import { FormControl, FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-pagos-proveedores',
  styleUrls: ['./pagos-proveedores.component.scss'],
  templateUrl: './pagos-proveedores.component.html',
})
export class ReportePagosProveedoresComponent implements OnInit {
  constructor(
    private service: ReportesService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  data = [];
  periodo = new FormControl();

  loading = true;
  total = 0;

  dateForm = this.formBuilder.group({
    desde: '',
    hasta: '',
  });

  sourceProveedores: any[];
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
      editButtonContent: '<i class="nb-search" data-toggle="tooltip" title="Ir al detalle del pedido"></i>',
    },
    columns: {
      fecha: {
        title: 'Fecha',
        type: 'text',
        sort: false,
      },
      importe: {
        title: 'Pago $',
        type: 'number',
      },
      pedido: {
        title: 'Pedido Nº',
        type: 'text',
      },
    },
  };

  ngOnInit() {
    this.cargarData();

    this.dateForm.valueChanges.subscribe((val) => {
      this.loading = true;
      this.service
        .pagosProveedores(val.desde, val.hasta)
        .then((res) => {
          this.sourceProveedores = this.mapSourceData(res);
          this.sourceProveedores.forEach((x) => {
            x.sourceData = new LocalDataSource();
            x.sourceData.load(x.pedidos);
          });

          this.data = this.mapBars(res);
          this.loading = false;
        });
    });
  }

  mapSourceData(response) {
    const result = [];
    response.forEach((p) => {
      const existente = result.find((x) => x.idProveedor === p.idProveedor);

      if (existente) {
        existente.pedidos.push(p);
        existente.total += p.importe;
      } else {
        result.push({
          idProveedor: p.idProveedor,
          nombre: p.nombre,
          pedidos: [p],
          total: p.importe,
        });
      }
    });

    return result;
  }

  mapBars(data: any[]) {
    const result = [];
    this.total = 0;

    data.forEach((x) => {
      const existente = result.find((r) => r.fecha === x.fecha);

      if (existente) {
        existente.total += x.importe;
      } else {
        result.push({ total: x.importe, ...x });
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
    this.service.pagosProveedores().then((res) => {
      this.sourceProveedores = this.mapSourceData(res);
      this.sourceProveedores.forEach((x) => {
        x.sourceData = new LocalDataSource();
        x.sourceData.load(x.pedidos);
      });

      this.data = this.mapBars(res);
      this.loading = false;
    });
  }

  onEditIngresos(event) {
    this.router.navigateByUrl(`pages/pedidos-proveedor/detalle/${event.data.id}`);
  }

  print(){
    window.print();
  }
}
