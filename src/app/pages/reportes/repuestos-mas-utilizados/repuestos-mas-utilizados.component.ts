import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../reportes.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ngx-repuestos-mas-utilizados',
  styleUrls: ['./repuestos-mas-utilizados.component.scss'],
  templateUrl: './repuestos-mas-utilizados.component.html',
})
export class ReporteRepuestoMasUtilizadoComponent implements OnInit{
  constructor(private service: ReportesService, private formBuilder: FormBuilder) {}

  data = [];
  dataMes = [];

  dateForm: FormGroup = this.formBuilder.group({
    desde: '',
    hasta: '',
  })

  ngOnInit() {
    this.service.repuestosMasUtilizados().then(res => {
      this.data = res;
    });

    // const ultimoMes = new Date();
    // ultimoMes.setDate(ultimoMes.getDate()-30);
    // this.service.repuestosMasUtilizados(ultimoMes).then(res => {
    //   this.dataMes = res;
    // });

    this.dateForm.valueChanges.subscribe(val => {
      this.service.repuestosMasUtilizados(val.desde, val.hasta).then(res => {
        this.data = res;
      });
    });
  }

  clearSearch() {
    this.dateForm.reset();
  }
}
