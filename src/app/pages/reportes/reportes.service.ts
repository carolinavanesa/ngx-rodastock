import { Injectable } from '@angular/core';

import { Parse } from 'parse';
import { AlertService } from '../../shared/alert.service';
import { DatePipe } from '@angular/common';

const Orden = Parse.Object.extend('Orden');
const PedidoProveedor = Parse.Object.extend('PedidoProveedor');
const RepuestoInventario = Parse.Object.extend('RepuestoInventario');
const Calificacion = Parse.Object.extend('Calificacion');
const ActualizacionStock = Parse.Object.extend('ActualizacionStock');

@Injectable()
export class ReportesService {
  constructor(private alertService: AlertService, private datePipe: DatePipe) {}

  async repuestosMasUtilizados(start?: Date, end?: Date) {
    let result = [];
    const query = new Parse.Query(ActualizacionStock);
    query.limit(1000);
    query.equalTo('tipo', 'egreso');
    query.include('repuesto');

    if(start) {
      query.greaterThan('createdAt', start);

      if(end) {
        end.setHours(23);
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

  private getStringNumeroPedido(numero: number){
    let resultStr = numero.toString();
    for (let index = 0; index < 8 - numero.toString().length; index++) {
      resultStr = '0' + resultStr;
    }

    return resultStr;
  }
  async ingresosMensualesReparaciones(start?: Date, end?: Date) {
    let result = [];
    const query = new Parse.Query(Orden);
    query.limit(1000);
    query.equalTo('deleted', false);
    query.equalTo('estado', 'Entregado');
    query.include('cliente');

    if(start) {
      query.greaterThan('fecha', start);

      if(end) {
        end.setHours(23);
        query.lessThan('fecha', end);
      } else {
        const newEnd = new Date(start);
        newEnd.setHours(23);
        query.lessThan('fecha', newEnd);
      }
    }

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
            // fecha: o.get('fecha'),
            // fechaEntrega: o.get('fechaEntrega'),
            fechaRetirado: o.get('fechaRetirado'),
            cliente: o.get('cliente'),
            calificacion: o.get('calificacion'),
            reparaciones: reparaciones[i],
            rodado: o.get('rodado'),
            estado: o.get('estado'),
            importe: o.get('importe'),
          };
        });
      });

      const rows = [];
      result.forEach(o => {
        o.reparaciones.forEach(r => {
          rows.push({
            id: o.id,
            fecha: this.datePipe.transform(o.fechaRetirado, 'dd/MM/yyyy'),
            cliente: o.cliente.get('nombre'),
            rodado: o.rodado,
            reparacion: r.get('nombre'),
            importe: r.get('costoRepuestos') + r.get('costoMano'),
            pedido: o.numero
          })
        });
      });

      return rows;
    } catch (e) {
      this.alertService.showPrimaryToast(
        'Error',
        'No se pudo cargar el reporte'
      );
    }

    return result;
  }

  async egresosMensuales(year?: number) {
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
      const arrayData = [];

      for (let i = 0; i < 12; i++) {
        arrayData.push({
          id: i,
          mes: this.meses[i],
          egreso: 0,
          cantidadPedidos: 0,
        });
      }
      response.forEach(orden => {
        const mes = orden.get('fecha').getMonth();
        const objetoMes = arrayData.find(x => x.id === mes)
        objetoMes.ingreso += orden.get('monto');
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
    query.include('cliente')

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

  async pagosProveedores(start?: Date, end?: Date){
    // let result = [];
    const query = new Parse.Query(PedidoProveedor);
    query.limit(1000);
    query.equalTo('estado', 'Recibido');
    query.include('proveedor');

    if(start) {
      query.greaterThan('fechaRecibido', start);

      if(end) {
        end.setHours(23);
        query.lessThan('fechaRecibido', end);
      } else {
        const newEnd = new Date(start);
        newEnd.setHours(23);
        query.lessThan('fechaRecibido', newEnd);
      }
    }

    try {
      const response = await query.find();

      return response.map(pedido => {
        return {
          id: pedido.id,
          idProveedor: pedido.get('proveedor').id,
          nombre: pedido.get('proveedor').get('nombre'),
          pedido: pedido.get('numero'),
          fecha: this.datePipe.transform(pedido.get('fechaRecibido'), 'dd/MM/yyyy'),
          importe: pedido.get('monto')
        }
      })
    } catch (e) {
      this.alertService.showPrimaryToast(
        'Error',
        'No se pudo cargar el reporte'
      );
    }
  }


}
