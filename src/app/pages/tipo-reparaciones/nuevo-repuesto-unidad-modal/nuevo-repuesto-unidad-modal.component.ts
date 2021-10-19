import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { InventarioService } from '../../inventario/inventario.service';


@Component({
  selector: 'ngx-nuevo-repuesto-unidad-modal',
  templateUrl: './nuevo-repuesto-unidad-modal.component.html',
  styleUrls: ['./nuevo-repuesto-unidad-modal.component.scss'],
})
export class NuevoRepuestoUnidadModalComponent {
  constructor(
    protected ref: NbDialogRef<NuevoRepuestoUnidadModalComponent>,
    private formBuilder: FormBuilder,
    private service: InventarioService
  ) {}


  myControl = new FormControl();
  options: any[] = [
    {name: 'Mary'},
    {name: 'Shelley'},
    {name: 'Igor'}
  ];
  filteredOptions: Observable<any[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
  }

  displayFn(user: any): string {
    return user && user.name ? user.name : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  // repuestoOptions = [];
  // myControl = new FormControl();
  // filteredOptions: Observable<string[]>;

  // nuevoForm: FormGroup = this.formBuilder.group({
  //   repuesto: ['' , [Validators.required]],
  //   cantidad: ['', [Validators.required, Validators.maxLength(3), Validators.pattern('[0-9]*')]],
  // });

  // ngOnInit() {
  //   this.service.cargarInventario().then(repuestos => this.repuestoOptions = repuestos)
  //   this.filteredOptions = this.myControl.valueChanges  //this.nuevoForm.get('repuesto').valueChanges
  //     .pipe(
  //       startWith(''),
  //       map(value => this._filter(value))
  //     );
  // }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.repuestoOptions.filter(option => option.nombre.toLowerCase().includes(filterValue));
  // }

  // dismiss() {
  //   this.ref.close(false);
  // }

  confirm() {
    // // Objeto completo de unidad para ser guardado en la pantalla de reparacion
    // const repuesto = this.repuestoOptions.find(r => r.id === this.nuevoForm.get('repuesto').value)

    // this.ref.close({
    //   repuesto: repuesto,
    //   cantidad: this.nuevoForm.get('cantidad').value
    // })
  }
}
