import { Injectable } from '@angular/core';

import { Parse } from 'parse';
import { AlertService } from '../../shared/alert.service';

const Orden = Parse.Object.extend('Orden');
const PedidoProveedor = Parse.Object.extend('PedidoProveedor');
const RepuestoInventario = Parse.Object.extend('RepuestoInventario');
const Calificacion = Parse.Object.extend('Calificacion');
const ActualizacionStock = Parse.Object.extend('ActualizacionStock');

@Injectable()
export class ReportesService {
  constructor(private alertService: AlertService) {}

  async repuestosMasUtilizados(start?: Date, end?: Date) {
    let result = [];
    const query = new Parse.Query(ActualizacionStock);
    query.limit(1000);
    query.equalTo('tipo', 'egreso');
    query.include('repuesto');

    if(start) {
      query.greaterThan('createdAt', start);

      if(end) {
        query.lessThan('createdAt', end);
      } else {
        const newEnd = new Date(start);
        newEnd.setHours(23);
        query.lessThan('createdAt', newEnd);
      }
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

      arrayData.sort(function(a, b) {
        return b.cantidad - a.cantidad;
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

  meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  async ingresosMensuales(year?: number) {
    let result = [];
    const query = new Parse.Query(Orden);
    query.limit(1000);
    query.equalTo('deleted', false);
    query.equalTo('estado', 'Entregado')

    const start = new Date();
    start.setMonth(0);
    start.setDate(1);
    start.setHours(0);

    const end = new Date();
    end.setMonth(11);
    end.setDate(31);
    end.setHours(23);

    if(year) {
      start.setFullYear(year);
      end.setFullYear(year);
    }

    query.greaterThan('fecha', start);
    query.lessThan('fecha', end);

    try {
      const response = await query.find();
      const today = new Date();

      const arrayData = [];

      for (let i = 0; i < 12; i++) {
        // let id = mesActual - i;

        // if (id < 1 ) {
        //   id = 11 + id
        // }
        arrayData.push({
          id: i,
          mes: this.meses[i],
          ingreso: 0,
          cantidadPedidos: 0,
        });
      }
      response.forEach(orden => {
        const mes = orden.get('fechaEntrega').getMonth();
        const objetoMes = arrayData.find(x => x.id === mes)
        objetoMes.ingreso += orden.get('importe');
        objetoMes.cantidadPedidos++
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

  async pedidosProveedorMensuales(year?: number) {
    let result = [];
    const query = new Parse.Query(PedidoProveedor);
    query.limit(1000);
    query.equalTo('deleted', false);
    query.equalTo('estado', 'Recibido')

    const start = new Date();
    start.setMonth(0);
    start.setDate(1);
    start.setHours(0);

    const end = new Date();
    end.setMonth(11);
    end.setDate(31);
    end.setHours(23);

    if(year) {
      start.setFullYear(year);
      end.setFullYear(year);
    }

    query.greaterThan('fecha', start);
    query.lessThan('fecha', end);

    try {
      const response = await query.find();
      const today = new Date();

      const arrayData = [];

      for (let i = 0; i < 12; i++) {
        // let id = mesActual - i;

        // if (id < 1 ) {
        //   id = 11 + id
        // }
        arrayData.push({
          id: i,
          mes: this.meses[i],
          cantidadPedidos: 0,
        });
      }
      response.forEach(orden => {
        const mes = orden.get('fecha').getMonth();
        const objetoMes = arrayData.find(x => x.id === mes)
        objetoMes.cantidadPedidos++
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


  async clientesMorosos() {
    let result = [];
    const query = new Parse.Query(Orden);
    query.limit(1000);
    query.equalTo('deleted', false);
    query.equalTo('estado', 'Terminado');
    query.include('cliente');
    query.lessThan('fechaEntrega', new Date());

    try {
      const response = await query.find();

      const arrayData = response.map(orden => {
        return {
          nombre: orden.get('cliente').get('nombre'),
          pedido: orden.get('numero'),
          rodado: orden.get('rodado'),
          debe: orden.get('importe') - orden.get('entregaInicial')
        }
      })

      return arrayData;
    } catch (e) {
      this.alertService.showPrimaryToast(
        'Error',
        'No se pudo cargar el reporte'
      );
    }

    return result;
  }

  async encuestaClientes(year?: number) {
    let result = [];
    const query = new Parse.Query(Calificacion);
    query.limit(1000);
    query.descending('createdAt');


    try {
      const response = await query.find();

      return response;
    } catch (e) {
      this.alertService.showPrimaryToast(
        'Error',
        'No se pudo cargar el reporte'
      );
    }

    return result;
  }


}
