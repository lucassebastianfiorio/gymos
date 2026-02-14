'use client';

import { UserRole } from '@/contracts';
import { useAuthStore } from '@/lib/auth/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { Shield, ChevronUp } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

export function RoleSwitcher() {
    const { user, login } = useAuthStore();

    if (!user) return null;

    const switchRole = (role: UserRole) => {
        // Map each role to its corresponding test user email
        const roleEmailMap: Record<UserRole, string> = {
            [UserRole.AdminGlobal]: 'admin@gymos.com',
            [UserRole.AdminTenant]: 'admintenant@gymos.com',
            [UserRole.Trainer]: 'trainer@gymos.com',
            [UserRole.Coach]: 'coach@gymos.com',
            [UserRole.Staff]: 'staff@gymos.com',
            [UserRole.Member]: 'member@gymos.com',
        };
        login(roleEmailMap[role]);
        window.location.reload(); // Reload to refresh permissions/routes
    };

    return (
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Shield className="h-4 w-4" />
                  <span>{user.role}</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuLabel>Cambiar Rol (Dev)</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.values(UserRole).map((role) => (
                    <DropdownMenuItem 
                        key={role} 
                        onClick={() => switchRole(role)}
                        className={user.role === role ? "bg-accent" : ""}
                    >
                        <span>{role}</span>
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
    )
}
