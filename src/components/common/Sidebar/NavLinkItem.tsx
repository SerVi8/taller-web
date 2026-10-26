import { Link } from "react-router-dom";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { NavItem } from "@/config/navigation";

interface Props {
  item: NavItem;
  isActive: boolean;
}

export function NavLinkItem({ item, isActive }: Props) {
  const Icon = item.icon;

  return (
    <Link to={item.url!} key={item.url}>
      <SidebarMenuItem>
        <SidebarMenuButton isActive={isActive} tooltip={item.title}>
          <Icon />
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </Link>
  );
}
