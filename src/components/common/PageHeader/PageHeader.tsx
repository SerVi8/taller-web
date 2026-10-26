import { type FC, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  hideHomeButton?: boolean;
};

const PageHeader: FC<PageHeaderProps> = ({
  title,
  action,
  description,
  hideHomeButton = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome =
    location.pathname === "/admin" || location.pathname === "/admin/";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="space-y-1">
        {!isHome && !hideHomeButton && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="-ml-2 h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/admin")}
          >
            <Home className="size-3.5" />
            Volver al inicio
          </Button>
        )}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default PageHeader;
