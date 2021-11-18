import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdenesService } from '../ordenes.service';
import { Location } from '@angular/common'


@Component({
  selector: 'ngx-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.scss'],
})
export class DetalleOrdenComponent implements OnInit {
  orden: any;
  reparaciones = [];
  costoTotalRepuestos = 0;
  costoTotalMano = 0;

  constructor(
    private service: OrdenesService,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // traer el objeto con ese id y patchear el form
      this.service.getOrden(id).then((orden) => {
        this.orden = orden;
        this.reparaciones = orden.reparacionesFetched.map((reparacion) => {
          return {
            id: reparacion.id,
            nombre: reparacion.get('nombre'),
            tiempoEstimado: reparacion.get('tiempoEstimado'),
            costoMano: reparacion.get('costoMano'),
            costoRepuestos: reparacion.get('costoRepuestos')
          };
        });

        this.calcularCostoTotalReparaciones();
      });
    }
  }

  calcularCostoTotalReparaciones() {
    this.costoTotalRepuestos = 0;
    this.costoTotalMano = 0;
    this.reparaciones.forEach((reparacion) => {
      this.costoTotalRepuestos += reparacion.costoRepuestos;
      this.costoTotalMano += reparacion.costoMano;
    });
  }
  calcularCostoTotalOrden() {
    return (
      this.costoTotalRepuestos +
      this.costoTotalMano +
      this.orden.get('costoAdicional')
    );
  }

  goBack() {
    this.location.back();
  }

  print(){
    window.print();
  }
}
