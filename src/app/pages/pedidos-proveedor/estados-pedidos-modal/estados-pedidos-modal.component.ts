import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

import { ModalService } from '../../../shared/modal/modal.service';
import { PedidosProveedorService } from '../pedidos-proveedor.service';

@Component({
  selector: 'ngx-estados-pedidos-modal',
  templateUrl: './estados-pedidos-modal.component.html',
  styleUrls: ['./estados-pedidos-modal.component.scss'],
})
export class EstadosPedidosModalComponent implements OnInit {
  constructor(
    protected ref: NbDialogRef<EstadosPedidosModalComponent>,
    private service: PedidosProveedorService,
    private modalService: ModalService
  ) {}

  loading = false;
  estado: string;
  pedido: any;
  calificacion: any;
  selectedIndex: number = 0;
  cancelado: boolean;
  completo: boolean;
  nuevoEstado: string;

  ngOnInit(): void {
    debugger
    this.mapEstados();
  }

  mapEstados() {
    switch (this.estado) {
      case 'Pendiente':
        this.selectedIndex = 0;
        break;
      case 'Solicitado':
        this.selectedIndex = 1;
        break;
      case 'Recibido':
        this.selectedIndex = 2;
        break;
      default:
        break;
    }
  }

  cambiarEstado(estado: string) {
    if (!this.loading) {
      this.loading = true;

      this.service
        .cambiarEstado(estado, this.pedido)
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
      body: `Estas seguro que quieres cancelar el pedido Nº ${this.pedido.numero}`,
      icon: 'exclamation',
    };
    this.modalService.showConfirmationModal(config).then((success) =>
      this.service.cambiarEstado('Cancelado', this.pedido).then((res) => {
        this.nuevoEstado = 'Cancelado';
        this.cancelado = true;
      })
    );
  }

  eliminar() {
    this.service.eliminar(this.pedido).then((res) => {
      this.ref.close('Eliminado');
    });
  }

  dismiss() {
    this.ref.close(this.nuevoEstado);
  }
}
