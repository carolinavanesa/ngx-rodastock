import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  templateUrl: './terminos-modal.component.html',
  styleUrls: ['./terminos-modal.component.scss'],
})
export class TerminosModalComponent implements OnInit {
  constructor(protected ref: NbDialogRef<TerminosModalComponent>) {}

  ngOnInit(): void {}

  dismiss(value: boolean) {
    this.ref.close(value);
  }
}
