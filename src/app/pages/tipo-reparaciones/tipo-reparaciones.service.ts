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
          costoMano: o.get('costoMano'),
        }
      })

    } catch (e) {
      this.alertService.showPrimaryToast('Error', 'No se pudo cargar el tipoReparacion');
    }

    return result;
  }

  async cargarTipoReparacionForModal() {
    let result = [];
    const query = new Parse.Query(TipoReparacion);
    query.limit(1000);
    query.equalTo('deleted', false);
    try {
      result = await query.find();
    } catch (e) {
      this.alertService.showPrimaryToast('Error', 'No se pudo cargar el inventario');
    }

    return result;
  }

  async getTipoReparacion(id: string) {
    const query = new Parse.Query(TipoReparacion);
    query.equalTo('deleted', false);
    query.equalTo('objectId', id);
    let result;

    try {
      result = await query.first();
      const repuestos = await result.get('repuestos').query().include('repuesto').find();
      result.repuestosFetched = repuestos;
    } catch (e) {
      this.alertService.showPrimaryToast('Error', 'No se pudo cargar la orden');
    }

    return result;
  }

  async agregarTipoReparacion(
    nombre: string,
    descripcion: string,
    tiempoEstimado: string,
    unidades: any[],
    costoMano: number,
    costoTotalRepuestos: number,
  ): Promise<boolean> {
    const nuevoTipoReparacion = new TipoReparacion();
    nuevoTipoReparacion.set('nombre', nombre);
    nuevoTipoReparacion.set('descripcion', descripcion);
    nuevoTipoReparacion.set('tiempoEstimado', tiempoEstimado);
    nuevoTipoReparacion.set('costoMano', costoMano);
    nuevoTipoReparacion.set('costoRepuestos', costoTotalRepuestos);

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
    nombre: string,
    descripcion: string,
    tiempoEstimado: string,
    unidades: any[],
    costoMano: number,
    parseObject: any,
    costoTotalRepuestos: number,
  ): Promise<boolean> {

    parseObject.set('nombre', nombre);
    parseObject.set('descripcion', descripcion);
    parseObject.set('tiempoEstimado', tiempoEstimado);
    parseObject.set('costoMano', costoMano);
    parseObject.set('costoRepuestos', costoTotalRepuestos);

    // Repuesta de todas los RepuestoUnidad que se guardaron
    let repuestoUnidadesSavedPromises = [];
    if(unidades.length > 0) {
      unidades.forEach(unidad => {
        if (!unidad.id) {
          const nuevoRepuestoUnidad = new RepuestoUnidad();
          nuevoRepuestoUnidad.set('cantidad', unidad.cantidad);
          nuevoRepuestoUnidad.set('repuesto', unidad.repuesto);

          try {
            repuestoUnidadesSavedPromises.push(nuevoRepuestoUnidad.save());
          } catch (e) {
            this.alertService.showErrorToast('Error', 'No se pudo agregar la Unidad ' + unidad.nombre);
          }
        }
      })
    }

    try {
      // Una vez todos terminados agregar la relation
      if (repuestoUnidadesSavedPromises.length > 0) {
        const repuestoUnidades = await Promise.all(repuestoUnidadesSavedPromises);
        parseObject.relation('repuestos').add(repuestoUnidades);
      }

      parseObject.save();
      this.alertService.showSuccessToast('Exito', 'Se ha editado el Tipo de Reparacion');
      return true;
    } catch (e) {
      this.alertService.showErrorToast('Error', 'No se pudo editar el Tipo de Reparacion');
      return false;
    }
  }

  async eliminarTipoReparacion(id: string): Promise<boolean> {
    const query = new Parse.Query(TipoReparacion);

    try {
      const tipoReparacionAEliminar = await query.get(id);
      tipoReparacionAEliminar.set('deleted', true);
      tipoReparacionAEliminar.save();
      this.alertService.showSuccessToast('Exito', 'Se ha eliminado un Tipo de Reparacion');
      return true;
    } catch (e) {
      this.alertService.showErrorToast(
        'Error',
        'No se pudo eliminar el Tipo de Reparacion'
      );
      return false;
    }
  }
}
