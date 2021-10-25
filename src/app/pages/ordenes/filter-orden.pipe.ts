import { Pipe, PipeTransform } from '@angular/core';

const { isArray } = Array;

@Pipe({
  name: 'filterOrden',
})
export class FilterOrdenPipe implements PipeTransform {
  transform(posts: any[], find: string): any[] {
    if (!posts) return [];
    if (!find) return posts;
    find = find.toLowerCase();
    return search(posts, find);
  }
}

function search(entries: any[], search: string) {
  search = search.toLowerCase();

  return entries.filter(function (obj) {
    const keys: string[] = Object.keys(obj);

    return (
      obj.numero.toString().includes(search) ||
      obj.cliente.get('nombre').toLowerCase().includes(search) ||
      obj.reparaciones.some((r) =>
        r.get('nombre').toLowerCase().includes(search)
      ) ||
      obj.rodado.toLowerCase().includes(search)
    );
  });
}
