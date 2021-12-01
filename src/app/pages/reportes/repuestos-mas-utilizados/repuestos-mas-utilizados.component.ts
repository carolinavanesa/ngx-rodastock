import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../reportes.service';

@Component({
  selector: 'ngx-repuestos-mas-utilizados',
  styleUrls: ['./repuestos-mas-utilizados.component.scss'],
  templateUrl: './repuestos-mas-utilizados.component.html',
})
export class ReporteRepuestoMasUtilizadoComponent implements OnInit{
  constructor(private service: ReportesService) {}

  data = [];
  dataMes = [];

  ngOnInit() {
    this.service.repuestosMasUtilizados().then(res => {
      this.data = res;
    });

    const ultimoMes = new Date();
    ultimoMes.setDate(ultimoMes.getDate()-30);
    this.service.repuestosMasUtilizados(ultimoMes).then(res => {
      this.dataMes = res;
    })
  }
}
