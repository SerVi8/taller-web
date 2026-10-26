import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Car,
  Package,
  Wrench,
  CalendarDays,
  CreditCard,
  Settings,
  Home,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
}

export interface NavItem {
  title: string;
  icon: LucideIcon;
  url?: string; // enlace directo
  items?: NavSubItem[]; // si existe, es un grupo colapsable
}

export const mainNavigation: NavItem[] = [
  {
    title: "Inicio",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Órdenes de trabajo",
    url: "/admin/orders",
    icon: ClipboardList,
  },
  {
    title: "Clientes",
    url: "/admin/clients",
    icon: Users,
  },
  {
    title: "Vehículos",
    url: "/admin/vehicles",
    icon: Car,
  },
  {
    title: "Inventario",
    icon: Package,
    items: [
      {
        title: "Productos",
        url: "/admin/inventory/products",
      },
      {
        title: "Movimiento",
        url: "/admin/inventory/movements",
      },
    ],
  },
  {
    title: "Servicios",
    url: "/admin/services",
    icon: Wrench,
  },
  {
    title: "Agenda",
    url: "/admin/agenda",
    icon: CalendarDays,
  },
  {
    title: "Pagos",
    url: "/admin/payments",
    icon: CreditCard,
  },
];

export const secondaryNavigation = [
  {
    title: "Configuración",
    url: "/admin/settings",
    icon: Settings,
  },
];
