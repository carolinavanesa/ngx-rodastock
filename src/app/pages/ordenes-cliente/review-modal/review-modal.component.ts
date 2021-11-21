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
    private formBuilder: FormBuilder,
  ) {}

  puntuacion: number;
  loading = false;

  nuevoForm: FormGroup = this.formBuilder.group({
    // puntuacion: ['', [Validators.required, Validators.maxLength(30), Validators.pattern("[a-zA-Z ,']*")]],
    comentario: ['', [Validators.maxLength(100), Validators.pattern("[a-zA-Z0-9 ,']*")]],
  });

  @Input() orden: any;
  @Input() calificacion: any;

  modoEdicion = false;

  ngOnInit(): void {
    this.modoEdicion = !this.calificacion;
  }

  onRatingChanged(rating: number) {
    this.puntuacion = rating;
  }

  onConfirm(){

  }

  dismiss() {
    this.ref.close();
  }
}
