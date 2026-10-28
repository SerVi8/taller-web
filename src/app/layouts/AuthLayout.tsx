import { Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/common/ThemeToggle/ThemeToggle";

const AuthLayout = () => {
  return (
    <main className="relative min-h-screen">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <Outlet />
    </main>
  );
};

export default AuthLayout;
