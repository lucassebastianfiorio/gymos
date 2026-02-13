"use client";

import Link from "next/link";

import { CircleHelp, ClipboardList, Command, Database, File, Search, Settings } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { rootUser } from "@/data/users";
import { navigationConfig } from "@/config/navigation";
import { useAuthStore } from "@/lib/auth/store";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";
import { RoleSwitcher } from "@/components/auth/role-switcher";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const _data = {
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: CircleHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: Database,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardList,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: File,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { sidebarVariant, sidebarCollapsible, isSynced } = usePreferencesStore(
    useShallow((s) => ({
      sidebarVariant: s.sidebarVariant,
      sidebarCollapsible: s.sidebarCollapsible,
      isSynced: s.isSynced,
    })),
  );
  
  const { user } = useAuthStore();

  const variant = isSynced ? sidebarVariant : props.variant;
  const collapsible = isSynced ? sidebarCollapsible : props.collapsible;

  const filteredNav = navigationConfig.map(group => {
      const filteredItems = group.items.filter(item => 
          !user || item.allowedRoles.includes(user.role)
      );
      return {
          ...group,
          items: filteredItems
      };
  }).filter(group => group.items.length > 0);

  return (
    <Sidebar {...props} variant={variant} collapsible={collapsible}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link prefetch={false} href="/dashboard/default">
                <Command />
                <span className="font-semibold text-base">{APP_CONFIG.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* We cast to any because NavMain expects likely different types from strict accumulation, 
            but structure matches. Or we can fix NavMain types later. 
            Actually, let's just pass it, existing type is NavGroup[], ours is NavGroup[] */}
        <NavMain items={filteredNav} />
      </SidebarContent>
      <SidebarFooter>
        <RoleSwitcher />
        <NavUser user={rootUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
