import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/config/navigation";

interface Props {
  item: NavItem;
  isActive: (url: string) => boolean;
}

export function NavGroupItem({ item, isActive }: Props) {
  const Icon = item.icon;
  const subItems = item.items ?? [];
  const hasActiveChild = subItems.some((sub) => isActive(sub.url));

  return (
    <SidebarMenuItem>
      <Collapsible
        key={item.title}
        defaultOpen={hasActiveChild}
        className="group/collapsible"
      >
        <CollapsibleTrigger className="group/trigger w-full">
          <SidebarMenuButton tooltip={item.title}>
            <Icon />
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-panel-open/trigger:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {subItems.map((sub) => (
              <Link to={sub.url} className="block" key={sub.url}>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton isActive={isActive(sub.url)}>
                    <span>{sub.title}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </Link>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
