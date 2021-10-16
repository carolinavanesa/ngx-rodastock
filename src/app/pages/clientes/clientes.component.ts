import { Component, OnDestroy, OnInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { ClientesService } from "./clientes.service";

@Component({
  selector: "ngx-dashboard",
  styleUrls: ["./clientes.component.scss"],
  templateUrl: "./clientes.component.html",
})
export class ClientesComponent implements OnInit, OnDestroy {
  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: "ID",
        type: "number",
        hide: true,
        editable: false,
      },
      nombre: {
        title: "Nombre",
        type: "string",
      },
      barrio: {
        title: "Barrio",
        type: "string",
      },
      telefono: {
        title: "Telefono",
        type: "number",
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: ClientesService) {}

  ngOnInit() {
    this.cargarCliente();
  }

  ngOnDestroy() {}

  cargarCliente() {
    this.service.cargarClientes().then((clientes) => {
      this.source.load(clientes);
    });
  }

  onDeleteConfirm(event: any) {
    this.service
      .eliminarCliente(
        event.newData.id
      )
      .then((res) => (res ? event.confirm.resolve() : event.confirm.reject()));
  }

  onCreateConfirm(event: any) {
    this.service
      .agregarCliente(
        event.newData.nombre,
        event.newData.barrio,
        Number(event.newData.telefono)
      )
      .then((res) => (res ? event.confirm.resolve() : event.confirm.reject()));
  }

  onEditConfirm(event: any) {
    this.service
      .editarCliente(
        event.newData.id,
        event.newData.nombre,
        event.newData.barrio,
        Number(event.newData.telefono)
      )
      .then((res) => {
        if (res) {
          event.confirm.resolve();
          this.cargarCliente();
        } else {
          event.confirm.reject();
        }
      });
  }
}
