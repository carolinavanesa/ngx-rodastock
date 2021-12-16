import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ReportesService } from '../reportes.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './cliente-morosos.component.html',
  styleUrls: ['./cliente-morosos.component.scss']
})
export class ClienteMorososComponent implements OnInit {

  constructor(private service: ReportesService, private router: Router) { }

  settings = {
    mode: 'external',
    actions: {
      add: false,
      delete: false,
      columnTitle: '',
    },
    edit: {
      editButtonContent: '<i class="nb-compose"></i>',
    },
    columns: {
      nombre: {
        title: 'Nombre',
        type: 'text',
        editable: false,
      },
      pedido: {
        title: 'Pedido Nº',
        type: 'text',
        editable: false,
      },
      rodado: {
        title: 'Rodado',
        type: 'text',
        editable: false,
      },
      debe: {
        title: 'Adeuda $',
        type: 'text',
        editable: false,
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  ngOnInit(): void {
    this.service.clientesMorosos().then((morosos) => {
      this.source.load(morosos);
    });
  }

  onEdit(event: any) {
    this.router.navigateByUrl(`pages/ordenes/search/${event.data.nombre}`);
  }

  print(){
    window.print();
  }

}
