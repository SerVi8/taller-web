import { Navigate, type RouteObject } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import { HomePage } from "@/features/home/pages/HomePage";
import AuthLayout from "../layouts/AuthLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ProtectedRoute, PublicOnlyRoute } from "./guards";

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
            element: <>Ordenes de trabajo</>,
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
