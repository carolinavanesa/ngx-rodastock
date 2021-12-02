import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { InventarioService } from '../../inventario/inventario.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AlertService } from '../../../shared/alert.service';

@Component({
  selector: 'ngx-nuevo-repuesto-unidad-modal',
  templateUrl: './nuevo-repuesto-unidad-modal.component.html',
  styleUrls: ['./nuevo-repuesto-unidad-modal.component.scss'],
})
export class NuevoRepuestoUnidadModalComponent {
  constructor(
    protected ref: NbDialogRef<NuevoRepuestoUnidadModalComponent>,
    private formBuilder: FormBuilder,
    private service: InventarioService,
    private alertService: AlertService,
  ) {}
  options = [];
  filteredOptions: Observable<any[]>;

  @Input() addedRepuestoUnidades = [];


  nuevoForm: FormGroup = this.formBuilder.group({
    repuesto: ['' , [Validators.required]],
    cantidad: ['', [Validators.required, Validators.maxLength(3), Validators.pattern('[0-9]*')]],
  });

  ngOnInit() {
    this.service.cargarInventarioForNuevaUnidad().then(repuestos => {
      this.options = this.addedRepuestoUnidades.length > 0 ? repuestos.filter(rep => this.addedRepuestoUnidades.find(a => a.repuesto.id !== rep.id)) : repuestos
    });

    this.filteredOptions = this.nuevoForm.get('repuesto').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.get('nombre').toLowerCase().includes(filterValue));
  }

  onCantidadChange(event: any){
    const stock = this.nuevoForm.get('cantidad').value;
    this.nuevoForm.get('cantidad').setValue(Math.floor(stock));
  }

  dismiss() {
    this.ref.close(false);
  }

  confirm() {
    // Objeto completo de unidad para ser guardado en la pantalla de reparacion
    const repuesto = this.options.find(r => r.get('nombre') === this.nuevoForm.get('repuesto').value)


    if (!repuesto) {
      this.alertService.showErrorToast('Error', 'Seleccione un repuesto existente')
    } else {
      this.ref.close({
        nombre: repuesto.get('nombre'),
        repuesto: repuesto,
        cantidad: this.nuevoForm.get('cantidad').value
      })
    }


  }
}
