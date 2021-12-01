import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../reportes.service';
import { FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ngx-ingresos-mensuales',
  styleUrls: ['./ingresos-mensuales.component.scss'],
  templateUrl: './ingresos-mensuales.component.html',
})
export class ReporteIngresosMensualesComponent implements OnInit{
  constructor(private service: ReportesService, private formBuilder: FormBuilder) {}

  data = [];
  periodo = new FormControl();
  periodoOptions = []

  repForm = this.formBuilder.group({
    periodo: [new Date().getFullYear()],
  });

  ngOnInit() {
    this.service.ingresosMensuales().then(res => {
      this.data = res;
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
}
