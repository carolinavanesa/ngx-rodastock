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

  estado: string;
  orden: any;
  selectedIndex: number = 0;
  cancelado: boolean;
  completo: boolean;
  nuevoEstado: string;

  ngOnInit(): void {
    this.mapEstados();
  }

  mapEstados(){
    switch (this.estado) {
      case 'Pendiente':
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
    this.service
      .cambiarEstado(estado, this.orden)
      .then((res) => {
        this.nuevoEstado = estado;
        if(estado === 'Entregado') {
          this.completo = true;
        }
      })
  }

  cancelar() {
    const config = {
      title: 'Cancelar Pedido',
      body: `Estas seguro que quieres cancelar el pedido Nº ${this.orden.numero}`,
      icon: 'exclamation',
    };
    this.modalService.showConfirmationModal(config).then(success =>
      this.service
      .cambiarEstado('Cancelado', this.orden)
      .then((res) => {
        this.nuevoEstado = 'Cancelado';
        this.cancelado = true;
      }));
  }

  eliminar() {

  }

  dismiss() {
    this.ref.close(this.nuevoEstado);
  }
}
