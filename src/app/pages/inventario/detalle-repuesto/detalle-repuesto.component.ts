import { Component, OnInit } from '@angular/core';
import { InventarioService } from '../inventario.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-detalle-repuesto',
  templateUrl: './detalle-repuesto.component.html',
  styleUrls: ['./detalle-repuesto.component.scss'],
})
export class DetalleRepuestoComponent implements OnInit {
  constructor(
    private service: InventarioService,
    private route: ActivatedRoute,
    // private location: Location,
  ) {}

  repuesto: any;
  listaIngresos = [];
  listaEgresos = [];
  inicial;

  ngOnInit(){
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.getRepuestoInventario(id).then((repuesto) => {
        this.repuesto = repuesto;

        this.service.cargarActualizacionStock().then((actualizaciones) => {
          this.listaIngresos = actualizaciones.filter(act => act.get('repuesto').id === repuesto.id &&  act.get('tipo') === 'ingreso');
          this.listaEgresos = actualizaciones.filter(act => act.get('repuesto').id === repuesto.id && act.get('tipo') === 'egreso');
          this.inicial = actualizaciones.find(act => act.get('repuesto').id === repuesto.id && act.get('tipo') === 'inicial');
        })
      });
    }

  }
}
