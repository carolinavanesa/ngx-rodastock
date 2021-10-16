import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Parse } from 'parse';
import { AlertService } from '../../shared/alert.service';

const Cliente = Parse.Object.extend('Cliente');

@Injectable()
export class ClientesService {
  constructor(private router: Router, private alertService: AlertService) {}

  async cargarClientes() {
    let result = [];
    const query = new Parse.Query(Cliente);
    query.limit(1000);
    query.equalTo('deleted', false);
    try {
      const response = await query.find();
      result = response.map((c) => {
        return {
          id: c.id,
          nombre: c.get('nombre'),
          barrio: c.get('barrio'),
          telefono: c.get('telefono'),
        };
      });
      console.log(result);
    } catch (e) {
      this.alertService.showPrimaryToast('Error', 'No se pudo cargar clientes');
    }

    return result;
  }

  async agregarCliente(
    nombre: string,
    barrio: string,
    telefono: number
  ): Promise<boolean> {
    const nuevoCliente = new Cliente();
    nuevoCliente.set('nombre', nombre);
    nuevoCliente.set('barrio', barrio);
    nuevoCliente.set('telefono', telefono);

    try {
      nuevoCliente.save();
      this.alertService.showSuccessToast('Exito', 'Se ha agregado un cliente');
      return true;
    } catch (e) {
      this.alertService.showErrorToast('Error', 'No se pudo cargar clientes');
      return false;
    }
  }

  async editarCliente(
    id: string,
    nombre: string,
    barrio: string,
    telefono: number
  ): Promise<boolean> {
    const query = new Parse.Query(Cliente);

    try {
      const clienteAEditar = await query.get(id);
      clienteAEditar.set('nombre', nombre);
      clienteAEditar.set('barrio', barrio);
      clienteAEditar.set('telefono', telefono);
      clienteAEditar.save();
      this.alertService.showSuccessToast(
        'Exito',
        'Se ha modificado un cliente'
      );
      return true;
    } catch (e) {
      this.alertService.showErrorToast(
        'Error',
        'No se pudo modificar el cliente'
      );
      return false;
    }
  }

  async eliminarCliente(id: string): Promise<boolean> {
    const query = new Parse.Query(Cliente);

    try {
      const clienteAEliminar = await query.get(id);
      clienteAEliminar.set('deleted', true);
      clienteAEliminar.save();
      this.alertService.showSuccessToast('Exito', 'Se ha eliminado un cliente');
      return true;
    } catch (e) {
      this.alertService.showErrorToast(
        'Error',
        'No se pudo eliminar el cliente'
      );
      return false;
    }
  }
}
