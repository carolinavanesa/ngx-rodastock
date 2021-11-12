import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { TipoReparacionService } from '../../tipo-reparaciones/tipo-reparaciones.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AlertService } from '../../../shared/alert.service';

@Component({
  selector: 'ngx-agregar-reparacion-modal',
  templateUrl: './agregar-reparacion-modal.component.html',
  styleUrls: ['./agregar-reparacion-modal.component.scss'],
})
export class AgregarReparacionModalComponent {
  constructor(
    protected ref: NbDialogRef<AgregarReparacionModalComponent>,
    private formBuilder: FormBuilder,
    private service: TipoReparacionService,
    private alertService: AlertService,
  ) {}
  options = [];
  filteredOptions: Observable<any[]>;

  @Input() addedReparaciones = [];


  nuevoForm: FormGroup = this.formBuilder.group({
    reparacion: ['' , [Validators.required]],
  });

  ngOnInit() {
    this.service.cargarTipoReparacionForModal().then(reparaciones => {
      // this.options = this.addedReparaciones.length > 0 ? reparaciones.filter(rep => this.addedReparaciones.find(a => a.id !== rep.id)) : reparaciones
      this.options = reparaciones
    });

    this.filteredOptions = this.nuevoForm.get('reparacion').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.get('nombre').toLowerCase().includes(filterValue));
  }

  dismiss() {
    this.ref.close(false);
  }

  confirm() {
    // Objeto completo de unidad para ser guardado en la pantalla de reparacion
    const reparacion = this.options.find(r => r.get('nombre') === this.nuevoForm.get('reparacion').value)

    reparacion

    if (!reparacion) {
      this.alertService.showErrorToast('Error', 'Seleccione una reaparacion existente')
    } else {
      this.ref.close({
        nombre: reparacion.get('nombre'),
        id: reparacion.id,
        costoMano: reparacion.get('costoMano'),
        costoRepuestos: reparacion.get('costoRepuestos'),
        tiempoEstimado: reparacion.get('tiempoEstimado'),
        reparacion: reparacion,
      })
    }
  }
}
