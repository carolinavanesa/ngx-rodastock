
import { Injectable } from '@angular/core';
import { Parse } from 'parse';
import { AlertService } from '../../shared/alert.service';

const RepuestoInventario = Parse.Object.extend('RepuestoInventario');
const RepuestoUnidad = Parse.Object.extend('RepuestoUnidad');
const ActualizacionStock = Parse.Object.extend('ActualizacionStock');

@Injectable()
export class InventarioService {
  constructor(private alertService: AlertService) {}

  async cargarInventario() {
    let result = [];
    const query = new Parse.Query(RepuestoInventario);
    query.limit(1000);
    query.equalTo('deleted', false);
    try {
      const response = await query.find();
      result = response.map((c) => {
        return {
          id: c.id,
          nombre: c.get('nombre'),
          costo: c.get('costo'),
          stock: c.get('stock'),
        };
      });
    } catch (e) {
      this.alertService.showPrimaryToast('Error', 'No se pudo cargar el inventario');
    }

    return result;
  }

  async getRepuestoInventario(id: string) {
    const query = new Parse.Query(RepuestoInventario);
    query.equalTo('deleted', false);
    query.equalTo('objectId', id);
    let result;

    try {
      result = await query.first();
    } catch (e) {
      this.alertService.showPrimaryToast(
        'Error',
        'No se pudo cargar el Repuesto'
      );
    }

    return result;
  }

  async cargarActualizacionStock() {
    let result = [];
    const query = new Parse.Query(ActualizacionStock);
    query.include('pedidoEgreso');
    query.include('pedidoIngreso');
    query.include('repuesto');
    query.descending("fechaCreacion");
    query.limit(5000);
    try {
      result = await query.find();
    } catch (e) {
      this.alertService.showPrimaryToast('Error', 'No se pudo cargar el detalle del repuesto');
    }

    return result;
  }

  async cargarInventarioForNuevaUnidad() {
    let result = [];
    const query = new Parse.Query(RepuestoInventario);
    query.limit(1000);
    query.equalTo('deleted', false);
    try {
      result = await query.find();
    } catch (e) {
      this.alertService.showPrimaryToast('Error', 'No se pudo cargar el inventario');
    }

    return result;
  }

  async agregarRepuestoInventario(
    nombre: string,
    costo: number,
    stock: number
  ): Promise<boolean> {
    const nuevoRepuesto = new RepuestoInventario();
    nuevoRepuesto.set('nombre', nombre);
    nuevoRepuesto.set('costo', costo);
    nuevoRepuesto.set('stock', stock);

    try {
      const res = await nuevoRepuesto.save();

      const nuevoActualizacionStock = new ActualizacionStock();
      nuevoActualizacionStock.set('repuesto', res);
      nuevoActualizacionStock.set('tipo', 'inicial');
      nuevoActualizacionStock.set('cantidad', stock);
      nuevoActualizacionStock.set('stockPrevio', 0);
      nuevoActualizacionStock.set('fechaCreacion', new Date());
      const resActualizacion = await nuevoActualizacionStock.save();

      this.alertService.showSuccessToast('Exito', 'Se ha agregado un nuevo repuesto');
      return true;
    } catch (e) {
      this.alertService.showErrorToast('Error', 'No se pudo agregar el repuesto');
      return false;
    }
  }

  async editarRepuestoInventario(
    id: string,
    nombre: string,
    costo: number,
    stock: number
  ): Promise<boolean> {
    const query = new Parse.Query(RepuestoInventario);

    try {
      const repuestoAEditar = await query.get(id);
      repuestoAEditar.set('nombre', nombre);
      repuestoAEditar.set('costo', costo);
      repuestoAEditar.set('stock', stock);
      repuestoAEditar.save();
      this.alertService.showSuccessToast(
        'Exito',
        'Se ha modificado un repuesto'
      );
      return repuestoAEditar;
    } catch (e) {
      this.alertService.showErrorToast(
        'Error',
        'No se pudo modificar el repuesto'
      );
      return false;
    }
  }

  async eliminarRepuestoInventario(id: string): Promise<boolean> {
    const query = new Parse.Query(RepuestoInventario);

    try {
      const repuestoAEliminar = await query.get(id);
      repuestoAEliminar.set('deleted', true);
      repuestoAEliminar.save();
      this.alertService.showSuccessToast('Exito', 'Se ha eliminado un repuesto');
      return true;
    } catch (e) {
      this.alertService.showErrorToast(
        'Error',
        'No se pudo eliminar el repuesto'
      );
      return false;
    }
  }

  async eliminarRepuestoUnidad(id: string): Promise<boolean> {
    const query = new Parse.Query(RepuestoUnidad);

    try {
      const repuestoAEliminar = await query.get(id);
      const result = await repuestoAEliminar.destroy();
      this.alertService.showSuccessToast('Exito', 'Se ha quitado el repuesto');
      return true;
    } catch (e) {
      this.alertService.showErrorToast(
        'Error',
        'No se pudo quitar el repuesto'
      );
      return false;
    }
  }


}
