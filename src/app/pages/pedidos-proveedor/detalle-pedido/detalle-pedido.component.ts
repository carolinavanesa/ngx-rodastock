import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { PedidosProveedorService } from '../pedidos-proveedor.service';


@Component({
  selector: 'ngx-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.scss'],
})
export class DetallePedidoComponent implements OnInit {
  pedido: any;
  unidades = [];
  costoTotalRepuestos = 0;
  costoTotalMano = 0;

  constructor(
    private service: PedidosProveedorService,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // traer el objeto con ese id y patchear el form
      this.service.getPedidoProveedor(id).then((pedido) => {
        this.pedido = pedido;
        this.unidades = pedido.repuestosFetched.map((unidad) => {
          return {
            id: unidad.id,
            repuesto: unidad.get('repuesto'),
            cantidad: unidad.get('cantidad'),
            nombre: unidad.get('repuesto').get('nombre'),
          };
        });


      });
    }
  }

  goBack() {
    this.location.back();
  }

  print(){
    window.print();
  }
}
