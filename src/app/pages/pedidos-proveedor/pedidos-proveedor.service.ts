import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Parse } from 'parse';
import { AlertService } from '../../shared/alert.service';

const PedidoProveedor = Parse.Object.extend('PedidoProveedor');
const RepuestoUnidad = Parse.Object.extend('RepuestoUnidad');

@Injectable()
export class PedidosProveedorService {
  constructor(private router: Router, private alertService: AlertService) {}

  async cargarPedidoProveedor() {
    let result = [];
    const query = new Parse.Query(PedidoProveedor);
    query.limit(1000);
    query.equalTo('deleted', false);
    try {
      const response = await query.find();

      result = response.map(o => {
        return {
          id: o.id,
          pedido: o,
          numero: o.get('numero'),
          nombreProveedor: o.get('nombreProveedor'),
          fecha: o.get('fecha'),
          notas: o.get('notas'),
          estado: o.get('estado'),
          monto: o.get('monto'),
        }
      })

    } catch (e) {
      this.alertService.showPrimaryToast('Error', 'No se pudo cargar el PedidoProveedor');
    }

    return result;
  }

  async cargarPedidoProveedorForModal() {
    let result = [];
    const query = new Parse.Query(PedidoProveedor);
    query.limit(1000);
    query.equalTo('deleted', false);
    try {
      result = await query.find();
    } catch (e) {
      this.alertService.showPrimaryToast('Error', 'No se pudo cargar el inventario');
    }

    return result;
  }

  async getPedidoProveedor(id: string) {
    const query = new Parse.Query(PedidoProveedor);
    query.equalTo('deleted', false);
    query.equalTo('objectId', id);
    let result;

    try {
      result = await query.first();
      const repuestos = await result.get('repuestos').query().include('repuesto').find();
      result.repuestosFetched = repuestos;
    } catch (e) {
      this.alertService.showPrimaryToast('Error', 'No se pudo cargar el pedido a proveedor');
    }

    return result;
  }

  async agregarPedidoProveedor(
    numero: number,
    nombreProveedor: string,
    fecha: Date,
    unidades: any[],
    notas: string,
    monto: number,
    estado: string,
  ): Promise<boolean> {
    const nuevoPedidoProveedor = new PedidoProveedor();
    nuevoPedidoProveedor.set('numero', numero);
    nuevoPedidoProveedor.set('nombreProveedor', nombreProveedor);
    nuevoPedidoProveedor.set('fecha', fecha);
    nuevoPedidoProveedor.set('notas', notas);
    nuevoPedidoProveedor.set('monto', monto);
    nuevoPedidoProveedor.set('estado', estado);

    // Repuesta de todas los RepuestoUnidad que se guardaron
    let repuestoUnidadesSavedPromises = [];
    if(unidades.length > 0) {
      unidades.forEach(unidad => {
        const nuevoRepuestoUnidad = new RepuestoUnidad();
        nuevoRepuestoUnidad.set('cantidad', unidad.cantidad);
        nuevoRepuestoUnidad.set('repuesto', unidad.repuesto);

        try {
          repuestoUnidadesSavedPromises.push(nuevoRepuestoUnidad.save());
        } catch (e) {
          this.alertService.showErrorToast('Error', 'No se pudo agregar la Unidad ' + unidad.nombre);
        }
      })
    }

    try {
      // Una vez todos terminados agregar la relation
      if (repuestoUnidadesSavedPromises.length > 0) {
        const repuestoUnidades = await Promise.all(repuestoUnidadesSavedPromises);
        nuevoPedidoProveedor.relation('repuestos').add(repuestoUnidades);
      }

      const res = await nuevoPedidoProveedor.save();
      this.alertService.showSuccessToast('Exito', 'Se ha agregado un nuevo Pedido a Proveedor');
      return true;
    } catch (e) {
      this.alertService.showErrorToast('Error', 'No se pudo agregar el Pedido a Proveedor');
      return false;
    }
  }

  async eliminar(parseObject: any) {
    try {
      parseObject.set('deleted', true);
      const res = await parseObject.save();
      this.alertService.showSuccessToast(
        'Exito',
        'Se elimino el Pedido Nº' + parseObject.get('numero')
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

  async cambiarEstado(estado: string, parseObject: any) {
    try {
      parseObject.set('estado', estado);
      const res = await parseObject.save();
      this.alertService.showSuccessToast('Exito', 'Pedido en estado ' + estado);
      return true;
    } catch (e) {
      this.alertService.showErrorToast(
        'Error',
        'No se pudo cambiar el estado del pedido'
      );
      return false;
    }
  }
}
