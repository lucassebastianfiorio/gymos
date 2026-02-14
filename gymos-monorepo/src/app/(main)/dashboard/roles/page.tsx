'use client';

import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/contracts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

const RESOURCES = [
    'Tenants',
    'Features',
    'Users',
    'Roles',
    'Settings',
    'Members',
    'Classes',
    'Staff'
];

// Mock permission matrix: Resource -> Role -> Access Level
// Simple boolean for now: Can Access?
const PERMISSIONS: Record<string, Record<UserRole, boolean>> = {
    'Tenants': {
        [UserRole.AdminGlobal]: true,
        [UserRole.AdminTenant]: false,
        [UserRole.Trainer]: false,
        [UserRole.Staff]: false,
        [UserRole.Member]: false,
        [UserRole.Coach]: false,
    },
     'Features': {
        [UserRole.AdminGlobal]: true,
        [UserRole.AdminTenant]: false,
        [UserRole.Trainer]: false,
        [UserRole.Staff]: false,
        [UserRole.Member]: false,
        [UserRole.Coach]: false,
    },
    'Users': {
        [UserRole.AdminGlobal]: true,
        [UserRole.AdminTenant]: true, // Managing own users
        [UserRole.Trainer]: false,
        [UserRole.Staff]: true, // Can see users
        [UserRole.Member]: false,
        [UserRole.Coach]: false,
    },
    'Roles': {
        [UserRole.AdminGlobal]: true,
        [UserRole.AdminTenant]: false,
        [UserRole.Trainer]: false,
        [UserRole.Staff]: false,
        [UserRole.Member]: false,
        [UserRole.Coach]: false,
    },
    'Members': {
        [UserRole.AdminGlobal]: false, // Indirectly via Tenant view
        [UserRole.AdminTenant]: true,
        [UserRole.Trainer]: true,
        [UserRole.Staff]: true,
        [UserRole.Member]: false,
        [UserRole.Coach]: false,
    },
    'Classes': {
         [UserRole.AdminGlobal]: false,
        [UserRole.AdminTenant]: true,
        [UserRole.Trainer]: true,
        [UserRole.Staff]: true, // Read-only usually
        [UserRole.Member]: true, // Book classes
        [UserRole.Coach]: false,
    }
};

const ROLES_DISPLAY = [
    UserRole.AdminGlobal,
    UserRole.AdminTenant,
    UserRole.Trainer,
    UserRole.Staff,
    UserRole.Member
];

export default function RolesPage() {
  return (
    <RoleGuard allowedRoles={[UserRole.AdminGlobal]}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Roles y Permisos</h1>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Matriz de Permisos</CardTitle>
                <CardDescription>
                    Resumen de los niveles de acceso para cada rol en los recursos del sistema. 
                    (Vista de solo lectura)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Recurso</TableHead>
                            {ROLES_DISPLAY.map(role => (
                                <TableHead key={role} className="text-center">{role}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {RESOURCES.map(resource => (
                            <TableRow key={resource}>
                                <TableCell className="font-medium">{resource}</TableCell>
                                {ROLES_DISPLAY.map(role => {
                                    const hasAccess = PERMISSIONS[resource]?.[role];
                                    return (
                                        <TableCell key={role} className="text-center">
                                            {hasAccess ? (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                    <Check className="w-3 h-3 mr-1" /> Acceso
                                                </Badge>
                                            ) : (
                                                 <span className="text-muted-foreground opacity-20">
                                                    <X className="w-3 h-3 mx-auto" />
                                                 </span>
                                            )}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}
