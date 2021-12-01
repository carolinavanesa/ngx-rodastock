import { Injectable } from '@angular/core';

import { Parse } from 'parse';
import { AlertService } from '../../shared/alert.service';

const Orden = Parse.Object.extend('Orden');
const RepuestoInventario = Parse.Object.extend('RepuestoInventario');
const Calificacion = Parse.Object.extend('Calificacion');
const ActualizacionStock = Parse.Object.extend('ActualizacionStock');

@Injectable()
export class ReportesService {
  constructor(private alertService: AlertService) {}

  async repuestosMasUtilizados(date?: Date) {
    let result = [];
    const query = new Parse.Query(ActualizacionStock);
    query.limit(1000);
    query.equalTo('tipo', 'egreso');
    query.include('repuesto');

    if(date) {
      query.greaterThan('createdAt', date);
    }

    try {
      const response = await query.find();
      const arrayData = [];
      response.forEach(actualizacion => {
        const repuestoInventario = actualizacion.get('repuesto');
        const resultRep = arrayData.find(x => x.id === repuestoInventario.id);

        if (resultRep) {
          resultRep.cantidad += actualizacion.get('cantidad');
        } else {
          arrayData.push({
            id: repuestoInventario.id,
            cantidad: actualizacion.get('cantidad'),
            nombre: repuestoInventario.get('nombre'),
            fecha: actualizacion.get('createdAt'),
          })
        }

      });

      return arrayData;
    } catch (e) {
      this.alertService.showPrimaryToast(
        'Error',
        'No se pudo cargar el reporte'
      );
    }

    return result;
  }
}
