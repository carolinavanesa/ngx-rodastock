import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'shopping-cart-outline',
    link: '/pages/dashboard',
    home: true,
    // data: { role: 'admin'}
  },
  {
    title: 'Clientes',
    icon: 'people-outline',
    link: '/pages/clientes',
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
    title: 'Pedidos',
    icon: 'paper-plane-outline',
    link: '/pages/ordenes',
  }
];

export const MENU_ITEMS_CLIENTE: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'shopping-cart-outline',
    link: '/pages/dashboard-cliente',
    home: true,
    // data: { role: 'admin'}
  },
  {
    title: 'Mis Pedidos',
    icon: 'paper-plane-outline',
    link: '/pages/mis-pedidos',
  }
];

