import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  // {
  //   title: 'Dashboard',
  //   icon: 'shopping-cart-outline',
  //   link: '/pages/dashboard',
  //   home: true,
  // },
  {
    title: 'Pedidos',
    icon: 'paper-plane-outline',
    link: '/pages/ordenes',
    home: true,
  },
  {
    title: 'Pedidos a Proveedores',
    icon: 'car-outline',
    link: '/pages/pedidos-proveedor',
  },
  {
    title: 'Inventario',
    icon: 'layers-outline',
    link: '/pages/inventario',
  },
  {
    title: 'Tipo Reparaciones',
    icon: 'brush-outline',
    link: '/pages/tipo-reparaciones',
  },
  {
    title: 'Clientes',
    icon: 'people-outline',
    link: '/pages/clientes',
  },
  {
    title: 'Proveedores',
    icon: 'people-outline',
    link: '/pages/proveedores',
  },
  {
    title: 'Reportes',
    icon: 'pie-chart-outline',
    children: [
      {
        title: 'Repuestos mas utilizados',
        link: '/pages/reportes/reporte1',
      },
      {
        title: 'Ingresos mensuales',
        link: '/pages/reportes/reporte2',
      },
      {
        title: 'Clientes morosos',
        link: '/pages/reportes/reporte3',
      },
      {
        title: 'Encuestas de satisfaccion',
        link: '/pages/reportes/reporte4',
      },
      {
        title: 'Pago a Proveedores',
        link: '/pages/reportes/reporte5',
      },
    ],
  },
];

export const MENU_ITEMS_CLIENTE: NbMenuItem[] = [
  {
    title: 'Mis Pedidos',
    icon: 'paper-plane-outline',
    link: '/pages/mis-pedidos',
    home: true,
  },
];
