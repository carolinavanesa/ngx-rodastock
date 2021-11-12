import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { take } from 'rxjs/operators';
import { ModalService } from '../../../shared/modal/modal.service';
import { InventarioService } from '../../inventario/inventario.service';
import { OrdenesService } from '../ordenes.service';
import { TipoReparacionService } from '../../tipo-reparaciones/tipo-reparaciones.service';
import { ClientesService } from '../../clientes/clientes.service';
import { MatSelect } from '@angular/material/select';
import { AlertService } from '../../../shared/alert.service';

@Component({
  selector: 'ngx-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.scss'],
})
export class DetalleOrdenComponent implements OnInit {
  orden: any;
  reparaciones = [];
  costoTotalRepuestos = 0;
  costoTotalMano = 0;

  constructor(
    private formBuilder: FormBuilder,
    private service: OrdenesService,
    private tipoReparacionService: TipoReparacionService,
    private clienteService: ClientesService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService,
    private alertService: AlertService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // traer el objeto con ese id y patchear el form
      this.service.getOrden(id).then((orden) => {
        this.orden = orden;
        this.reparaciones = orden.reparacionesFetched.map((reparacion) => {
          return {
            id: reparacion.id,
            nombre: reparacion.get('nombre'),
            tiempoEstimado: reparacion.get('tiempoEstimado'),
            costoMano: reparacion.get('costoMano'),
            costoRepuestos: reparacion.get('costoRepuestos')
          };
        });

        this.calcularCostoTotalReparaciones();
      });
    }
  }

  ngOnDestroy() {}

  calcularCostoTotalReparaciones() {
    this.costoTotalRepuestos = 0;
    this.costoTotalMano = 0;
    this.reparaciones.forEach((reparacion) => {
      this.costoTotalRepuestos += reparacion.costoRepuestos;
      this.costoTotalMano += reparacion.costoMano;
    });
  }
  calcularCostoTotalOrden() {
    return (
      this.costoTotalRepuestos +
      this.costoTotalMano +
      this.orden.get('costoAdicional')
    );
  }

  goBack() {
    this.router.navigateByUrl(`pages/ordenes`);
  }

  print(){
    window.print();
  }
}
