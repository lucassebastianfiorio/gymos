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
  CalendarDays,
  MapPin,
  Percent,
  Sparkles
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
        title: "Gimnasios (Tenants)",
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
        allowedRoles: [UserRole.AdminGlobal, UserRole.AdminTenant],
      },
    ],
  },
  {
    id: 2,
    label: "Gestión",
    items: [
       {
        title: "Sucursales",
        url: "/dashboard/locations",
        icon: MapPin,
        allowedRoles: [UserRole.AdminTenant],
      },
       {
        title: "Pagos & Finanzas",
        url: "/dashboard/payments",
        icon: Banknote,
        allowedRoles: [UserRole.AdminTenant, UserRole.Staff],
      },
      {
        title: "Caja",
        url: "/dashboard/finance/caja",
        icon: Banknote,
        allowedRoles: [UserRole.AdminTenant, UserRole.Staff],
      },
       {
        title: "Miembros",
        url: "/dashboard/members",
        icon: Users,
        allowedRoles: [UserRole.AdminTenant, UserRole.Trainer, UserRole.Staff],
      },
      {
        title: "Clases",
        url: "/dashboard/schedule",
        icon: CalendarDays,
        allowedRoles: [UserRole.AdminTenant, UserRole.Trainer, UserRole.Staff],
      },
      {
         title: "Gestión de Rutinas",
         url: "/dashboard/routines/manage",
         icon: Dumbbell,
         allowedRoles: [UserRole.AdminTenant, UserRole.Trainer],
      },
      {
        title: "Ejercicios",
        url: "/dashboard/exercises",
        icon: Dumbbell,
        allowedRoles: [UserRole.AdminTenant, UserRole.Trainer],
      },
      {
         title: "Personal (Staff)",
         url: "/dashboard/staff",
         icon: Users,
         allowedRoles: [UserRole.AdminTenant],
       },
       {
         title: "Servicios",
         url: "/dashboard/services",
         icon: Sparkles,
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
              title: "Clases Reservadas",
              url: "/dashboard/schedule",
              icon: CalendarDays,
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
              title: "Configuración de Mora",
              url: "/dashboard/settings/finance",
              icon: Percent,
              allowedRoles: [UserRole.AdminTenant],
          },
          {
              title: "Ajustes del Sistema",
              url: "/dashboard/settings",
              icon: Settings,
              allowedRoles: [UserRole.AdminGlobal, UserRole.AdminTenant],
          }
      ]
  }
];
