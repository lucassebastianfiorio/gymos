import {
  Banknote,
  ChartBar,
  LayoutDashboard,
  Settings,
  Users,
  Building,
  Zap,
  Lock,
  type LucideIcon,
  Dumbbell,
  CalendarDays
} from "lucide-react";
import { UserRole } from "@gymos/contracts";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  allowedRoles: UserRole[];
  items?: NavItem[]; // nested items
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavItem[];
}

export const navigationConfig: NavGroup[] = [
  {
    id: 1,
    label: "Plataforma",
    items: [
      {
        title: "Panel Principal",
        url: "/dashboard/default",
        icon: LayoutDashboard,
        allowedRoles: [UserRole.AdminGlobal, UserRole.AdminTenant, UserRole.Trainer, UserRole.Staff],
      },
      {
        title: "Sedes (Tenants)",
        url: "/dashboard/tenants",
        icon: Building,
        allowedRoles: [UserRole.AdminGlobal],
      },
      {
        title: "Funcionalidades",
        url: "/dashboard/features",
        icon: Zap,
        allowedRoles: [UserRole.AdminGlobal],
      },
      {
        title: "Roles y Permisos",
        url: "/dashboard/roles",
        icon: Lock,
        allowedRoles: [UserRole.AdminGlobal],
      },
    ],
  },
  {
    id: 2,
    label: "Gestión",
    items: [
       {
        title: "Miembros",
        url: "/dashboard/members",
        icon: Users,
        allowedRoles: [UserRole.AdminTenant, UserRole.Trainer, UserRole.Staff],
      },
      {
        title: "Clases",
        url: "/dashboard/classes",
        icon: CalendarDays,
        allowedRoles: [UserRole.AdminTenant, UserRole.Trainer],
      },
      {
         title: "Personal (Staff)",
         url: "/dashboard/staff",
         icon: Dumbbell,
         allowedRoles: [UserRole.AdminTenant],
      }
    ]
  },
  {
      id: 3,
      label: "Configuración",
      items: [
          {
              title: "Ajustes del Sistema",
              url: "/dashboard/settings",
              icon: Settings,
              allowedRoles: [UserRole.AdminGlobal, UserRole.AdminTenant],
          }
      ]
  }
];
