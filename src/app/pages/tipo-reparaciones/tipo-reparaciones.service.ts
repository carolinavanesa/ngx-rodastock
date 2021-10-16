import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Parse } from 'parse';
import { AlertService } from '../../shared/alert.service';

const TipoReparacion = Parse.Object.extend('TipoReparacion');

@Injectable()
export class TipoReparacionService {
  constructor(private router: Router, private alertService: AlertService) {}

  async cargarTipoReparacion() {
    let result = [];
    const query = new Parse.Query(TipoReparacion);
    query.limit(1000);
    query.equalTo('deleted', false);
    try {
      const response = await query.find();

      result = response.map(o => {
        return {
          id: o.id,
          nombre: o.get('nombre'),
          descripcion: o.get('descripcion'),
          tiempoEstimado: o.get('tiempoEstimado'),
          imagen: o.get('imagen')._url
        }
      })

      console.log(result);
    } catch (e) {
      this.alertService.showPrimaryToast('Error', 'No se pudo cargar el tipoReparacion');
    }

    return result;
  }

  async agregarTipoReparacion(
    nombre: string,
    costo: number,
    stock: number
  ): Promise<boolean> {
    const nuevoTipoReparacion = new TipoReparacion();
    nuevoTipoReparacion.set('nombre', nombre);
    nuevoTipoReparacion.set('costo', costo);
    nuevoTipoReparacion.set('stock', stock);

    try {
      nuevoTipoReparacion.save();
      this.alertService.showSuccessToast('Exito', 'Se ha agregado un nuevo tipoReparacion');
      return true;
    } catch (e) {
      this.alertService.showErrorToast('Error', 'No se pudo agregar el tipoReparacion');
      return false;
    }
  }

  async editarTipoReparacion(
    id: string,
    nombre: string,
    costo: number,
    stock: number
  ): Promise<boolean> {
    const query = new Parse.Query(TipoReparacion);

    try {
      const tipoReparacionAEditar = await query.get(id);
      tipoReparacionAEditar.set('nombre', nombre);
      tipoReparacionAEditar.set('costo', costo);
      tipoReparacionAEditar.set('stock', stock);
      tipoReparacionAEditar.save();
      this.alertService.showSuccessToast(
        'Exito',
        'Se ha modificado un tipoReparacion'
      );
      return true;
    } catch (e) {
      this.alertService.showErrorToast(
        'Error',
        'No se pudo modificar el tipoReparacion'
      );
      return false;
    }
  }

  async eliminarTipoReparacion(id: string): Promise<boolean> {
    const query = new Parse.Query(TipoReparacion);

    try {
      const tipoReparacionAEliminar = await query.get(id);
      tipoReparacionAEliminar.set('deleted', true);
      tipoReparacionAEliminar.save();
      this.alertService.showSuccessToast('Exito', 'Se ha eliminado un tipoReparacion');
      return true;
    } catch (e) {
      this.alertService.showErrorToast(
        'Error',
        'No se pudo eliminar el tipoReparacion'
      );
      return false;
    }
  }
}
