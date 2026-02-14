'use client';

import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/contracts';
import { mockTenants } from '@/data/tenants';
import { mockMembers } from '@/data/members';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Building, Plus, Settings, Users, } from 'lucide-react';
import { useAuthStore } from '@/lib/auth/store';
import { memberDashboardData } from '@/data/member-dashboard';

export default function DashboardDefaultPage() {
  const { user } = useAuthStore();
  const totalTenants = mockTenants.length;
  const activeTenants = mockTenants.filter((t) => t.status === 'Active').length;
  const totalUsers = mockTenants.reduce((acc, curr) => acc + curr.userCount, 0);
  const activeMembers = mockMembers.filter((m) => m.status === 'Active').length;
  const totalMembers = mockMembers.length;

  /* MEMBER DASHBOARD VIEW */
  if (user?.role === UserRole.Member) {
      return (
          <div className="flex flex-col gap-6">
              <h1 className="text-2xl font-bold tracking-tight">Hola, {user.name} 👋</h1>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* NEXT CLASS CARD */}
                  <Card>
                      <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Próxima Clase</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{memberDashboardData.nextClass.name}</div>
                          <p className="text-xs text-muted-foreground">
                              {memberDashboardData.nextClass.date} - {memberDashboardData.nextClass.time}
                          </p>
                          <div className="mt-2 text-sm text-blue-600">
                             Con {memberDashboardData.nextClass.instructor}
                          </div>
                      </CardContent>
                  </Card>

                   {/* MEMBERSHIP STATUS */}
                   <Card>
                      <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Mi Membresía</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{memberDashboardData.membership.plan}</div>
                          <div className="flex items-center gap-2 mt-1">
                               <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                                  {memberDashboardData.membership.status}
                               </span>
                               <span className="text-xs text-muted-foreground">
                                  Vence en {memberDashboardData.membership.daysLeft} días
                               </span>
                          </div>
                      </CardContent>
                  </Card>
              </div>

               {/* RECENT ACTIVITY */}
               <Card className="md:col-span-2 lg:col-span-1">
                  <CardHeader>
                      <CardTitle>Actividad Reciente</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          {memberDashboardData.recentActivity.map((act, i) => (
                              <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                                  <div>
                                      <p className="font-medium text-sm">{act.activity}</p>
                                      <p className="text-xs text-muted-foreground">{act.date}</p>
                                  </div>
                                  <div className="text-xs font-mono">{act.time}</div>
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          </div>
      );
  }

  /* ADMIN GLOBAL - MULTI-GYM MANAGEMENT VIEW */
  if (user?.role === UserRole.AdminGlobal) {
    return (
      <RoleGuard allowedRoles={[UserRole.AdminGlobal]}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Resumen del Panel</h1>
          </div>

          {/* METRICS ROW */}
          <div className="grid gap-4 md:grid-cols-3">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total de Gimnasios</CardTitle>
                      <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{totalTenants}</div>
                      <p className="text-xs text-muted-foreground">
                          {activeTenants} activos actualmente
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
                          En todos los gimnasios
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
                      <CardTitle>Gimnasios Recientes</CardTitle>
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
                              <Plus className="mr-2 h-4 w-4" /> Agregar Nuevo Gimnasio
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

  /* ADMIN TENANT / TRAINER / STAFF - SINGLE GYM MANAGEMENT VIEW */
  return (
    <RoleGuard allowedRoles={[UserRole.AdminTenant, UserRole.Trainer, UserRole.Staff]}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Resumen del Panel</h1>
        </div>

        {/* METRICS ROW */}
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Miembros</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalMembers}</div>
                    <p className="text-xs text-muted-foreground">
                        {activeMembers} activos actualmente
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Clases Programadas</CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">
                        Esta semana
                    </p>
                </CardContent>
            </Card>
            <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Asistencias Hoy</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">45</div>
                    <p className="text-xs text-muted-foreground">
                        Check-ins registrados
                    </p>
                </CardContent>
            </Card>
        </div>

        {/* QUICK ACTIONS & RECENT */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Miembros Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockMembers.slice(0, 5).map(member => (
                            <div key={member.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-sm text-muted-foreground">{member.membershipPlan}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                     <div className={`px-2 py-1 rounded text-xs ${
                                        member.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                        member.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {member.status === 'Active' ? 'Activo' : member.status}
                                    </div>
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/dashboard/members`}>
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
                        <Link href="/dashboard/members">
                            <Users className="mr-2 h-4 w-4" /> Ver Todos los Miembros
                        </Link>
                    </Button>
                    {user?.role !== UserRole.Trainer && (
                      <Button variant="outline" className="w-full justify-start" asChild>
                          <Link href="/dashboard/finance">
                              <Settings className="mr-2 h-4 w-4" /> Ver Finanzas
                          </Link>
                      </Button>
                    )}
                    <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/dashboard/classes">
                            <Settings className="mr-2 h-4 w-4" /> Gestionar Clases
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </RoleGuard>
  );
}
