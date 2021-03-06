import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../reportes.service';
import { FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ngx-pedidos-mensuales',
  styleUrls: ['./pedidos-mensuales.component.scss'],
  templateUrl: './pedidos-mensuales.component.html',
})
export class ReportePedidosMensualesComponent implements OnInit{
  constructor(private service: ReportesService, private formBuilder: FormBuilder) {}

  data = [];
  data2 = [];
  periodo = new FormControl();
  periodoOptions = []

  repForm = this.formBuilder.group({
    periodo: [new Date().getFullYear()],
  });

  ngOnInit() {
    this.service.ingresosMensuales().then(res => {
      this.data = res;
    });

    this.service.pedidosProveedorMensuales().then(res => {
      this.data2 = res;
    });

    const year = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
      this.periodoOptions.push(year-i);
    }
  }

  onPeriodoChange(event) {
    this.service.ingresosMensuales(event.value).then(res => {
      this.data = res;
    });
  }

  hayIngresos(){
    return this.data.some(x => x.ingreso > 0);
  }
}
