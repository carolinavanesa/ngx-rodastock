import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Parse } from 'parse';
import { AlertService } from '../../shared/alert.service';

const RepuestoInventario = Parse.Object.extend('RepuestoInventario');
const RepuestoUnidad = Parse.Object.extend('RepuestoUnidad');

@Injectable()
export class InventarioService {
  constructor(private router: Router, private alertService: AlertService) {}

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
      nuevoRepuesto.save();
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
      return true;
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
