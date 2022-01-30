import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ReportesService } from '../reportes.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './encuestas-cliente.component.html',
  styleUrls: ['./encuestas-cliente.component.scss']
})
export class EncuestasClienteComponent implements OnInit {

  constructor(private service: ReportesService, private router: Router) { }

  encuestas = [];
  noEncuestas = false;

  ngOnInit(): void {
    this.service.encuestaClientes().then((encuestas) => {
      this.encuestas = encuestas;
      if (encuestas.length === 0) {
        this.noEncuestas = true;
      }
    });
  }

  calcularPromedio() {
    let promedio = 0;
    this.encuestas.forEach(x => promedio += x.get('puntuacion'));
    return promedio / this.encuestas.length;
  }

  calcularChart(){
    let sumAtencion = 0;
    let sumCalidad = 0;
    let sumTiempo = 0;
    let sumPrecio = 0;
    const n = this.encuestas.length;

    this.encuestas.forEach(x => {
      sumAtencion += x.get('atencion') || 0;
      sumCalidad += x.get('calidadTrabajo') || 0;
      sumTiempo += x.get('tiempoEntrega') || 0;
      sumPrecio += x.get('precio') || 0;
    });

    return [sumAtencion/n, sumCalidad/n, sumTiempo/n, sumPrecio/n]
  }

  onEdit(event: any) {
    this.router.navigateByUrl(`pages/ordenes/search/${event.data.nombre}`);
  }

  print(){
    window.print();
  }

}
