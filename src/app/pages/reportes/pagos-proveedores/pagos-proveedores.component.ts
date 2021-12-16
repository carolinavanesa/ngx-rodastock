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
export class ReportePagosProveedoresComponent implements OnInit{
  constructor(private service: ReportesService, private formBuilder: FormBuilder, private router: Router) {}

  data = [];
  periodo = new FormControl();

  loading = true;
  total = 0;

  dateForm = this.formBuilder.group({
    desde: '',
    hasta: '',
  })

  sourceProveedores: any[];
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
    this.service.pagosProveedores().then(res => {
      this.sourceProveedores = this.mapSourceData(res);
      this.sourceProveedores.forEach(x => {
        x.sourceData = new LocalDataSource();
        x.sourceData.load(x.pedidos);
      });

      this.data = this.mapBars(res);
      this.loading = false;
    });

    // const year = new Date().getFullYear();
    // for (let i = 0; i < 5; i++) {
    //   this.periodoOptions.push(year-i);
    // }

    this.dateForm.valueChanges.subscribe(val => {
      this.loading = true;
      this.service.ingresosMensualesReparaciones(val.desde, val.hasta).then(res => {
        // this.sourceIngreso.load(res);
        // this.data = this.mapBars(res);
        // this.loading = false;
      });
    });
  }

  mapSourceData(response){
    const result = [];
    response.forEach(p => {
      const existente = result.find(x => x.id === p.get('proveedor').id)

      if (existente) {
        existente.pedidos.push({ id: p.id, fecha: p.get('updatedAt'), importe: p.get('monto'), pedido: p.get('numero')});
        existente.total += p.get('monto');
      } else {
        result.push({
          id: p.get('proveedor').id,
          proveedor: p.get('proveedor'),
          pedidos: [{ id: p.id, fecha: p.get('updatedAt'), importe: p.get('monto'), pedido: p.get('numero')}],
          total: p.get('monto'),
        })
      }
    });

    return result;
  }

  mapBars(data: any[]){
    const result = [];
    this.total = 0;

    data.forEach(x => {
      const existente = result.find(r => r.get('updatedAt') === x.get('updatedAt'));

      if (existente) {
        existente.total += x.monto;
      } else {
        result.push({ total: x.monto, ...x })
      }

      this.total += x.get('monto');
    });

    return result;
  }

  clearSearch() {
    this.dateForm.reset();
  }

  onEditIngresos(event) {
    this.router.navigateByUrl(`pages/ordenes/detalle-orden/${event.data.id}`);
  }
}
