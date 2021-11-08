import { Injectable } from '@angular/core';

import { Parse } from 'parse';
import { AlertService } from '../../shared/alert.service';

const Orden = Parse.Object.extend('Orden');
// const TipoReparacion = Parse.Object.extend('TipoReparacion');

@Injectable()
export class OrdenesService {
  constructor(private alertService: AlertService) {}

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

  async getOrden(id: string) {
    const query = new Parse.Query(Orden);
    query.equalTo('deleted', false);
    query.equalTo('objectId', id);
    let result;

    try {
      result = await query.first();
      const reparaciones = await result.get('reparaciones').query().find();
      result.reparacionesFetched = reparaciones;
    } catch (e) {
      this.alertService.showPrimaryToast('Error', 'No se pudo cargar la orden');
    }

    return result;
  }

  async getSiguienteNumeroOrden() {
    const query = new Parse.Query(Orden);

    let result = 0;

    try {
      result = await query.count();
    } catch (e) {
      this.alertService.showPrimaryToast('Error', 'No se pudo cargar la orden');
    }

    let resultStr = result.toString();
    for (let index = 0; index < (8 - result.toString().length ); index++) {
      resultStr = '0' + resultStr;
    }

    return resultStr;
  }

  async agregarOrden(
    numero: number,
    fecha: Date,
    cliente: any,
    telefono: string,
    rodado: string,
    observaciones: string,
    costoAdicional: number,
    fechaEntrega: Date,
    reparaciones: any[],
    importe: number,
    file?: any,
  ): Promise<boolean> {
    debugger
    const nuevaOrden = new Orden();
    nuevaOrden.set('numero', numero);
    nuevaOrden.set('fecha', fecha);
    nuevaOrden.set('cliente', cliente);
    nuevaOrden.set('telefono', telefono);
    nuevaOrden.set('rodado', rodado);
    nuevaOrden.set('observaciones', observaciones);
    nuevaOrden.set('costoAdicional', costoAdicional);
    nuevaOrden.set('fechaEntrega', fechaEntrega);
    nuevaOrden.relation('reparaciones').add(reparaciones);
    nuevaOrden.set('importe', importe);

    const fileData = new Parse.File("orden-" + numero + ".png", file);

    try {
      if(file) {
        const savedFile = await fileData.save();
        nuevaOrden.set('imagen', savedFile);
      }
      const res = await nuevaOrden.save();
      this.alertService.showSuccessToast('Exito', 'Se ha generado una nueva Orden');
      return true;
    } catch (e) {
      this.alertService.showErrorToast('Error', 'No se pudo generar la orden');
      return false;
    }
  }



}
