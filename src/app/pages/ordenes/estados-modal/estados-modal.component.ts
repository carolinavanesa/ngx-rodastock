import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { OrdenesService } from '../ordenes.service';
import { ModalService } from '../../../shared/modal/modal.service';

@Component({
  selector: 'ngx-estados-modal',
  templateUrl: './estados-modal.component.html',
  styleUrls: ['./estados-modal.component.scss'],
})
export class EstadosModalComponent implements OnInit {
  constructor(
    protected ref: NbDialogRef<EstadosModalComponent>,
    private service: OrdenesService,
    private modalService: ModalService
  ) {}

  loading = false;
  estado: string;
  orden: any;
  calificacion: any;
  selectedIndex: number = 0;
  cancelado: boolean;
  completo: boolean;
  nuevoEstado: string;

  reparaciones = [];
  repuestos = [];
  erroresDeStock = [];

  ngOnInit(): void {

    this.mapEstados();
  }

  mapEstados() {
    switch (this.estado) {
      case 'Pendiente':
        this.service.getRepuestosFromReparaciones(this.reparaciones).then((repuestos) => {
          // this.reparaciones.forEach((reparacion) => {
          //   reparacion.repuestosFetched.forEach((rep) => {
              // this.repuestos.push(rep);

              repuestos.forEach((rep) => {
                const nombre = rep.get('repuesto')?.get('nombre');
                const stock = rep.get('repuesto')?.get('stock');
                const cantidad = rep.get('cantidad');
                if (stock < rep.get('cantidad')) {
                  this.erroresDeStock.push({
                    repuesto: nombre,
                    stock: stock,
                    cantidad: cantidad,
                  });
                }
              })
          //   });
          // })
        });
        this.selectedIndex = 0;
        break;

      case 'En Curso':
        this.selectedIndex = 1;
        break;

      case 'Terminado':
        this.selectedIndex = 2;
        break;

      case 'Entregado':
        this.completo = true;
        break;

      case 'Cancelado':
        this.cancelado = true;
        break;

      default:
        break;
    }
  }

  cambiarEstado(estado: string) {
    if (!this.loading) {
      this.loading = true;

      this.service
        .cambiarEstado(estado, this.orden, this.repuestos)
        .then((res) => {
          this.nuevoEstado = estado;
          if (estado === 'Entregado') {
            this.completo = true;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  cancelar() {
    const config = {
      title: 'Cancelar Pedido',
      body: `Estas seguro que quieres cancelar el pedido Nº ${this.orden.numero}`,
      icon: 'exclamation',
    };
    this.modalService.showConfirmationModal(config).then((success) =>
      this.service.cambiarEstado('Cancelado', this.orden, this.repuestos).then((res) => {
        this.nuevoEstado = 'Cancelado';
        this.cancelado = true;
      })
    );
  }

  eliminar() {
    this.service.eliminar(this.orden).then((res) => {
      this.ref.close('Eliminado');
    });
  }

  dismiss() {
    this.ref.close(this.nuevoEstado);
  }
}
