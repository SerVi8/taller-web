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

export const mainNavigation = [
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
    url: "/admin/inventory",
    icon: Package,
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