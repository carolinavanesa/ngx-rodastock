import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

import { ModalService } from '../../../shared/modal/modal.service';
import { OrdenesService } from '../../ordenes/ordenes.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ngx-review-modal',
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.scss'],
})
export class ReviewModalComponent implements OnInit {
  constructor(
    protected ref: NbDialogRef<ReviewModalComponent>,
    private service: OrdenesService,
    private formBuilder: FormBuilder
  ) {}

  puntuacionTiempoEntrega: number;
  puntuacionCalidadTrabajo: number;
  puntuacionAtencion: number;
  puntuacionPrecio: number;
  loading = false;

  nuevoForm: FormGroup = this.formBuilder.group({
    // puntuacion: ['', [Validators.required, Validators.maxLength(30), Validators.pattern("[a-zA-Z ,']*")]],
    comentario: [
      '',
      [Validators.maxLength(100), Validators.pattern("[a-zA-Z0-9ñº# ,'!?]*")],
    ],
  });

  @Input() orden: any;
  @Input() calificacion: any;

  modoEdicion = false;

  ngOnInit(): void {
    this.modoEdicion = !this.calificacion;
  }

  onRatingChanged(rating: number, field: string) {
    switch (field) {
      case 'tiempoEntrega':
        this.puntuacionTiempoEntrega = rating;
        break;
      case 'calidadTrabajo':
        this.puntuacionCalidadTrabajo = rating;
        break;
      case 'atencion':
        this.puntuacionAtencion = rating;
        break;
      case 'precio':
        this.puntuacionPrecio = rating;
        break;
      default:
        break;
    }
  }

  onConfirm() {
    if (!this.loading) {
      this.loading = true;
      this.service
        .agregarCalificacion(
          this.puntuacionTiempoEntrega,
          this.puntuacionCalidadTrabajo,
          this.puntuacionAtencion,
          this.puntuacionPrecio,
          this.nuevoForm.get('comentario').value,
          this.orden
        )
        .then((res) => {
          if (res) {
            this.ref.close(res);
          }
        })
        .catch();
    }
  }

  dismiss() {
    this.ref.close();
  }
}
