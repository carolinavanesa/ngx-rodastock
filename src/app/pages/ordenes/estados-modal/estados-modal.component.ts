import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { OrdenesService } from '../ordenes.service';

@Component({
  selector: 'ngx-estados-modal',
  templateUrl: './estados-modal.component.html',
  styleUrls: ['./estados-modal.component.scss'],
})
export class EstadosModalComponent implements OnInit {
  constructor(
    protected ref: NbDialogRef<EstadosModalComponent>,
    private service: OrdenesService
  ) {}

  estado: string;
  orden: any;
  selectedIndex: number = 0;
  cancelada: boolean;
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
        this.cancelada = true;
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

  dismiss() {
    this.ref.close(this.nuevoEstado);
  }
}
