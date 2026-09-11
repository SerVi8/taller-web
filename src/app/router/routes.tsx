import { Navigate, type RouteObject } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  return (
    <>
      <Button>Boton</Button>
    </>
  );
};

export const routes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/h" replace />,
      },
      {
        path: "h",
        element: <DashboardPage />,
      },
    ],
  },
];