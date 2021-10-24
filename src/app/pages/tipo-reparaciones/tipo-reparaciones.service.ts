import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Parse } from 'parse';
import { AlertService } from '../../shared/alert.service';

const TipoReparacion = Parse.Object.extend('TipoReparacion');
const RepuestoUnidad = Parse.Object.extend('RepuestoUnidad');

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
    descripcion: string,
    tiempoEstimado: string,
    unidades: any[],
  ): Promise<boolean> {
    const nuevoTipoReparacion = new TipoReparacion();
    nuevoTipoReparacion.set('nombre', nombre);
    nuevoTipoReparacion.set('descripcion', descripcion);
    nuevoTipoReparacion.set('tiempoEstimado', tiempoEstimado);

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
        nuevoTipoReparacion.relation('repuestos').add(repuestoUnidades);
      }

      nuevoTipoReparacion.save();
      this.alertService.showSuccessToast('Exito', 'Se ha agregado un nuevo Tipo de Reparacion');
      return true;
    } catch (e) {
      this.alertService.showErrorToast('Error', 'No se pudo agregar el Tipo de Reparacion');
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
