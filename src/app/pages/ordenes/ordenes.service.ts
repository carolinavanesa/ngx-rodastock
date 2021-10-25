import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Parse } from 'parse';
import { AlertService } from '../../shared/alert.service';

const Orden = Parse.Object.extend('Orden');

@Injectable()
export class OrdenesService {
  constructor(private router: Router, private alertService: AlertService) {}

  async cargarOrdenes() {
    let result = [];
    const query = new Parse.Query(Orden);
    query.limit(1000);
    query.equalTo('deleted', false);
    query.include('cliente');
    try {
      const response = await query.find();

      let reparacionesPromises = [];

      response.forEach((o) => {
        reparacionesPromises.push(o.get('reparaciones').query().find());
      });

      result = await Promise.all(reparacionesPromises).then((reparaciones) => {
        return response.map((o, i) => {
          return {
            id: o.id,
            orden: o,
            numero: o.get('numero'),
            fecha: o.get('fecha'),
            fechaEntrega: o.get('fechaEntrega'),
            cliente: o.get('cliente'),
            reparaciones: reparaciones[i],
            rodado: o.get('rodado'),
            estado: o.get('estado'),
            importe: o.get('importe'),
            imagen: o.get('imagen')._url,
          };
        });
      });
    } catch (e) {
      this.alertService.showPrimaryToast(
        'Error',
        'No se pudo cargar el tipoReparacion'
      );
    }

    return result;
  }


  private g
}
