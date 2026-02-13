'use client';

import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@gymos/contracts';
import { mockTenants } from '@/data/tenants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Building, Plus, Settings, Users } from 'lucide-react';

export default function DashboardDefaultPage() {
  const totalTenants = mockTenants.length;
  const activeTenants = mockTenants.filter((t) => t.status === 'Active').length;
  const totalUsers = mockTenants.reduce((acc, curr) => acc + curr.userCount, 0);

  return (
    <RoleGuard allowedRoles={[UserRole.AdminGlobal, UserRole.AdminTenant, UserRole.Trainer, UserRole.Staff]}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Resumen del Panel</h1>
        </div>

        {/* METRICS ROW */}
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Sedes</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalTenants}</div>
                    <p className="text-xs text-muted-foreground">
                        {activeTenants} activas actualmente
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Usuarios</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        En todas las sedes
                    </p>
                </CardContent>
            </Card>
            <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">Saludable</div>
                    <p className="text-xs text-muted-foreground">
                        Todos los sistemas operativos
                    </p>
                </CardContent>
            </Card>
        </div>

        {/* QUICK ACTIONS & RECENT */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Sedes Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockTenants.slice(0, 5).map(tenant => (
                            <div key={tenant.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium">{tenant.name}</p>
                                    <p className="text-sm text-muted-foreground">{tenant.plan}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                     <div className={`px-2 py-1 rounded text-xs ${
                                        tenant.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {tenant.status === 'Active' ? 'Activo' : tenant.status}
                                    </div>
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/dashboard/tenants/${tenant.id}`}>
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            
            <Card className="col-span-3">
                <CardHeader>
                    <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Button className="w-full justify-start" asChild>
                        <Link href="/dashboard/tenants">
                            <Plus className="mr-2 h-4 w-4" /> Agregar Nueva Sede
                        </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                         <Link href="/dashboard/features">
                            <Settings className="mr-2 h-4 w-4" /> Gestionar Features Globales
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
