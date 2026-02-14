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
import { UserRole } from "@/contracts";

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
        allowedRoles: [UserRole.AdminGlobal, UserRole.AdminTenant, UserRole.Trainer, UserRole.Staff, UserRole.Member],
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
      {
        title: "Planes de Suscripción",
        url: "/dashboard/plans",
        icon: Banknote,
        allowedRoles: [UserRole.AdminGlobal],
      },
    ],
  },
  {
    id: 2,
    label: "Gestión",
    items: [
       {
        title: "Finanzas",
        url: "/dashboard/finance",
        icon: Banknote,
        allowedRoles: [UserRole.AdminTenant],
      },
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
         title: "Gestión de Rutinas",
         url: "/dashboard/routines/manage",
         icon: Dumbbell,
         allowedRoles: [UserRole.AdminTenant, UserRole.Trainer],
      },
      {
         title: "Control de Acceso",
         url: "/dashboard/access",
         icon: Lock,
         allowedRoles: [UserRole.AdminTenant, UserRole.Staff],
      },
      {
         title: "Personal (Staff)",
         url: "/dashboard/staff",
         icon: Users, // Changed icon to Users for staff to avoid duplicate Dumbbell
         allowedRoles: [UserRole.AdminTenant],
      }
    ]
  },
  {
      id: 3,
      label: "Mi Espacio",
      items: [
          {
              title: "Mi Rutina",
              url: "/dashboard/routines",
              icon: Dumbbell,
              allowedRoles: [UserRole.Member],
          },
          {
              title: "Mis Pagos",
              url: "/dashboard/payments",
              icon: Banknote,
              allowedRoles: [UserRole.Member],
          },
          {
              title: "Mi Progreso",
              url: "/dashboard/progress",
              icon: ChartBar,
              allowedRoles: [UserRole.Member],
          }
      ]
  },
  {
      id: 4,
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
