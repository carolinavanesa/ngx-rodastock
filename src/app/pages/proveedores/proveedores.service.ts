import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Parse } from 'parse';
import { AlertService } from '../../shared/alert.service';

const Proveedor = Parse.Object.extend('Proveedor');

@Injectable()
export class ProveedoresService {
  constructor(private router: Router, private alertService: AlertService) {}

  async cargarProveedores() {
    let result = [];
    const query = new Parse.Query(Proveedor);
    query.limit(1000);
    query.equalTo('deleted', false);
    try {
      const response = await query.find();
      result = response.map((c) => {
        return {
          id: c.id,
          nombre: c.get('nombre'),
          direccion: c.get('direccion'),
          telefono: c.get('telefono'),
          email: c.get('email'),
          proveedor: c,
        };
      });
    } catch (e) {
      this.alertService.showPrimaryToast('Error', 'No se pudo cargar proveedors');
    }

    return result;
  }

  async agregarProveedor(
    nombre: string,
    direccion: string,
    telefono: string,
    email: string,
  ): Promise<boolean> {
    const nuevoProveedor = new Proveedor();
    nuevoProveedor.set('nombre', nombre);
    nuevoProveedor.set('direccion', direccion);
    nuevoProveedor.set('telefono', telefono);
    nuevoProveedor.set('email', email);

    try {
      const res = await nuevoProveedor.save();
      this.alertService.showSuccessToast('Exito', 'Se ha agregado un proveedor');
      return true;
    } catch (e) {
      this.alertService.showErrorToast('Error', 'No se pudo cargar proveedors');
      return false;
    }
  }

  async editarProveedor(
    id: string,
    nombre: string,
    direccion: string,
    telefono: string
  ): Promise<boolean> {
    const query = new Parse.Query(Proveedor);

    try {
      const proveedorAEditar = await query.get(id);
      proveedorAEditar.set('nombre', nombre);
      proveedorAEditar.set('direccion', direccion);
      proveedorAEditar.set('telefono', telefono);
      const res = await proveedorAEditar.save();
      this.alertService.showSuccessToast(
        'Exito',
        'Se ha modificado un proveedor'
      );
      return true;
    } catch (e) {
      this.alertService.showErrorToast(
        'Error',
        'No se pudo modificar el proveedor'
      );
      return false;
    }
  }

  async eliminarProveedor(id: string): Promise<boolean> {
    const query = new Parse.Query(Proveedor);

    try {
      const proveedorAEliminar = await query.get(id);
      proveedorAEliminar.set('deleted', true);
      proveedorAEliminar.save();
      this.alertService.showSuccessToast('Exito', 'Se ha eliminado un proveedor');
      return true;
    } catch (e) {
      this.alertService.showErrorToast(
        'Error',
        'No se pudo eliminar el proveedor'
      );
      return false;
    }
  }
}
