import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

const { isArray } = Array;

@Pipe({
  name: 'filterOrden',
})
export class FilterOrdenPipe implements PipeTransform {

  constructor(private datePipe: DatePipe){}


  transform(posts: any[], find: string): any[] {
    if (!posts) return [];
    if (!find) return posts;
    find = find.toLowerCase();
    return this.search(posts, find);
  }

  private search(entries: any[], search: string) {
    search = search.toLowerCase();
    const self = this;

    return entries.filter(function (obj) {
      const keys: string[] = Object.keys(obj);

      return (
        obj.numero.toString().includes(search) ||
        obj.cliente.get('nombre').toLowerCase().includes(search) ||
        obj.reparaciones.some((r) =>
          r.get('nombre').toLowerCase().includes(search)
        ) ||
        obj.rodado?.toLowerCase().includes(search) ||
        obj.estado?.toLowerCase().includes(search) ||
        obj.fechaEntrega?.toString().includes(search) ||
        self.datePipe.transform(obj.fecha, 'dd/MM/yyyy').includes(search) ||
        self.datePipe.transform(obj.fechaEntrega, 'dd/MM/yyyy').includes(search)
      );
    });
  }
}


