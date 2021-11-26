import { Injectable } from '@angular/core';

import { Parse } from 'parse';
import { AlertService } from '../../shared/alert.service';

const Orden = Parse.Object.extend('Orden');
const Calificacion = Parse.Object.extend('Calificacion');
const ActualizacionStock = Parse.Object.extend('ActualizacionStock');

@Injectable()
export class OrdenesService {
  constructor(private alertService: AlertService) {}

  async cargarOrdenes() {
    let result = [];
    const query = new Parse.Query(Orden);
    query.limit(1000);
    query.equalTo('deleted', false);
    query.include('cliente');
    query.include('calificacion');
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
            numero: this.getStringNumeroPedido(o.get('numero')),
            fecha: o.get('fecha'),
            fechaEntrega: o.get('fechaEntrega'),
            cliente: o.get('cliente'),
            calificacion: o.get('calificacion'),
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
        'No se pudo cargar los pedidos'
      );
    }

    return result;
  }

  async includeRepuestosFromReparaciones(tipoReparaciones: any[]){
    let repuestoPromises = [];
    // let result = [];

    tipoReparaciones.forEach((o) => {
      repuestoPromises.push(o.get('repuestos').query().include('repuesto').find());
    });

    const repuestosPorReparacion = await Promise.all(repuestoPromises);

    tipoReparaciones.forEach((o, i) => {
      o.repuestos = repuestosPorReparacion[i]
    });

    return tipoReparaciones;
  }

  async getOrden(id: string) {
    const query = new Parse.Query(Orden);
    query.equalTo('deleted', false);
    query.equalTo('objectId', id);
    query.include('cliente');
    let result;

    try {
      result = await query.first();
      const reparaciones = await result.get('reparaciones').query().find();
      result.reparacionesFetched = reparaciones;
      result.numeroStr = this.getStringNumeroPedido(result.get('numero'));
    } catch (e) {
      this.alertService.showPrimaryToast(
        'Error',
        'No se pudo cargar el pedido'
      );
    }

    return result;
  }

  async getSiguienteNumeroOrden() {
    const query = new Parse.Query(Orden);

    let result = 0;

    try {
      result = await query.count();
    } catch (e) {
      this.alertService.showPrimaryToast(
        'Error',
        'No se pudo cargar el pedido'
      );
    }

    // let resultStr = result.toString();
    // for (let index = 0; index < 8 - result.toString().length; index++) {
    //   resultStr = '0' + resultStr;
    // }

    return this.getStringNumeroPedido(result);
  }

  private getStringNumeroPedido(numero: number){
    let resultStr = numero.toString();
    for (let index = 0; index < 8 - numero.toString().length; index++) {
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
    file?: any
  ): Promise<boolean> {
    ;
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

    try {
      if (file) {
        const fileData = new Parse.File('orden-' + numero + '.png', file);
        const savedFile = await fileData.save();
        nuevaOrden.set('imagen', savedFile);
      }
      const res = await nuevaOrden.save();
      this.alertService.showSuccessToast(
        'Exito',
        'Se ha generado un nuevo Pedido Nº ' + numero
      );
      return true;
    } catch (e) {
      this.alertService.showErrorToast('Error', 'No se pudo generar el pedido');
      return false;
    }
  }

  async cambiarEstado(estado: string, parseObject: any, repuestos: any[]) {
    try {
      parseObject.set('estado', estado);
      const res = await parseObject.save();
      this.alertService.showSuccessToast('Exito', 'Pedido en estado ' + estado);
      switch (estado) {
        case 'En Curso':
          this.sendEmail({
            toEmail: parseObject.get('cliente').get('email'),
            subject: 'Pedido de Reparacion En Curso!',
            body:
              'Tu Pedido de Reparacion Nº' +
              this.getStringNumeroPedido(parseObject.get('numero'))+
              ' de ' +
              parseObject.get('rodado') +
              ' se encuentra en curso. Pronto te notificaremos cuando este listo para ser retirado!',
          });

          // Actualizar stock
          debugger
          const resultadoInventario = await this.actualizarStock(res, repuestos)

          break;
        case 'Terminado':
          this.sendEmail({
            toEmail: parseObject.get('cliente').get('email'),
            subject: 'Pedido de Reparacion Listo!',
            body:
              'Tu Pedido de Reparacion Nº' +
              this.getStringNumeroPedido(parseObject.get('numero'))+
              ' de ' +
              parseObject.get('rodado') +
              ' se encuentra listo para ser retirado!',
          });
          break;
        case 'Entregado':
          this.sendEmail({
            toEmail: parseObject.get('cliente').get('email'),
            subject: 'Pedido Entregado! Contanos que te parecio!',
            body:
              'Tu Pedido de Reparacion Nº' +
              this.getStringNumeroPedido(parseObject.get('numero'))+
              ' de ' +
              parseObject.get('rodado') +
              ' ha sido entregado. Por favor tomate unos minutos para evaluar el servicio brindado en: <LINK>',
          });
          break;
        case 'Cancelado':
          this.sendEmail({
            toEmail: parseObject.get('cliente').get('email'),
            subject: 'Pedido de Reparacion Cancelado!',
            body:
              'Tu Pedido de Reparacion Nº' +
              this.getStringNumeroPedido(parseObject.get('numero'))+
              ' de ' +
              parseObject.get('rodado') +
              'se ha cancelado. Por favor contactese con el Proveedor',
          });
          break;

        default:
          break;
      }

      return true;
    } catch (e) {
      this.alertService.showErrorToast(
        'Error',
        'No se pudo cambiar el estado del pedido'
      );
      return false;
    }
  }

  async actualizarStock(parseObject: any, repuestosUnidad: any[]) {
    let repuestoInventarioPromises = [];
    let actualizacionStockPromises = []
    repuestosUnidad.forEach((o) => {
      const repuestoInventario = o.get('repuesto');
      const stockPrevio = repuestoInventario.get('stock');
      const nuevoStock = stockPrevio - o.get('cantidad');
      repuestoInventario.set('stock', nuevoStock)
      repuestoInventarioPromises.push(repuestoInventario.save());

      const nuevoActualizacionStock = new ActualizacionStock();
      nuevoActualizacionStock.set('pedidoEgreso', parseObject);
      nuevoActualizacionStock.set('tipo', 'egreso');
      nuevoActualizacionStock.set('repuesto', repuestoInventario);
      nuevoActualizacionStock.set('cantidad', o.get('cantidad'));
      nuevoActualizacionStock.set('stockPrevio', stockPrevio);
      actualizacionStockPromises.push(nuevoActualizacionStock.save());
    });

    if (repuestoInventarioPromises.length > 0) {
      const resultadoInventario = await Promise.all([...repuestoInventarioPromises, ...actualizacionStockPromises]);
      this.alertService.showPrimaryToast('Exito', 'Se ha actualizado el stock de los repuestos listados');
    }
  }

  sendEmail(body: any) {
    Parse.Cloud.run('sendgridEmail', body);
  }

  async eliminar(parseObject: any) {
    try {
      parseObject.set('deleted', true);
      const res = await parseObject.save();
      this.alertService.showSuccessToast(
        'Exito',
        'Se elimino el Pedido Nº' + this.getStringNumeroPedido(parseObject.get('numero'))
      );
      return true;
    } catch (e) {
      this.alertService.showErrorToast(
        'Error',
        'No se pudo eliminar el pedido'
      );
      return false;
    }
  }

  async agregarCalificacion(
    puntuacion: number,
    comentario: string,
    ordenParse: any,
  ): Promise<boolean> {
    ;
    const nuevaCalificacion = new Calificacion();
    nuevaCalificacion.set('puntuacion', puntuacion);
    nuevaCalificacion.set('comentario', comentario);

    try {
      const resSaved = await nuevaCalificacion.save();
      ordenParse.set('calificacion', resSaved);
      const res = await ordenParse.save();
      this.alertService.showSuccessToast(
        'Exito',
        'Se ha guardado tu calificación '
      );

      return true;
    } catch (e) {
      this.alertService.showErrorToast('Error', 'No se pudo guardar la calificación');
      return false;
    }
  }
}
