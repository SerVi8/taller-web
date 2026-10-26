import { Navigate, type RouteObject } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import { HomePage } from "@/features/home/pages/HomePage";
import AuthLayout from "../layouts/AuthLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ProtectedRoute, PublicOnlyRoute } from "./guards";
import { ClientsPage } from "@/features/clients/pages/ClientsPage";
import { ProductPage } from "@/features/inventory/pages/ProductsPage";
import { StockMovementsPage } from "@/features/inventory/pages/StockMovementsPage";
import { OrdersPage } from "@/features/orders/pages/OrdersPage";
import { CreateOrderPage } from "@/features/orders/pages/CreateOrderPage";
import { OrderWorkspacePage } from "@/features/orders/pages/OrderWorkspacePage";

export const routes: RouteObject[] = [
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: "/login",
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "orders",
            children: [
              {
                index: true,
                element: <OrdersPage />,
              },
              {
                path: "new",
                element: <CreateOrderPage />,
              },
              {
                path: ":code",
                element: <OrderWorkspacePage />,
              },
            ],
          },
          {
            path: "clients",
            element: <ClientsPage />,
          },
          {
            path: "inventory",
            children: [
              {
                path: "products",
                element: <ProductPage />,
              },
              {
                path: "movements",
                element: <StockMovementsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to={"/admin"} replace />,
  },
];
