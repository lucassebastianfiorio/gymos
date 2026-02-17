'use client';

import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/contracts';
import { mockTenants } from '@/data/tenants';
import { mockMembers } from '@/data/members';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Building, CreditCard, MapPin, Plus, Settings, Users, BrainCircuit } from 'lucide-react';
import { useAuthStore } from '@/lib/auth/store';
import { isFeatureEnabled } from '@/data/feature-flags';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getLocationsByTenant } from '@/data/locations';
import { MemberProfile } from '../_components/member/member-profile';
import { MemberAttendance } from '../_components/member/member-attendance';
import { MemberTimer } from '../_components/member/member-timer';
import { MemberRoutineView } from '../_components/member/member-routine-view';
import { MemberProgress } from '../_components/member/member-progress';
import { MemberClasses } from '../_components/member/member-classes';
import { MemberDocs } from '../_components/member/member-docs';
import { MemberNotes } from '../_components/member/member-notes';
import { MessageList } from '../_components/messaging/message-list';
import { SendMessageForm } from '../_components/messaging/send-message-form';

export default function DashboardDefaultPage() {
  const { user, selectedLocationId, setSelectedLocationId } = useAuthStore();
  
  const totalTenants = mockTenants.length;
  const activeTenants = mockTenants.filter((t) => t.status === 'Active').length;
  const totalUsers = mockTenants.reduce((acc, curr) => acc + curr.userCount, 0);

  // Filter members by location if selected
  const locationMembers = selectedLocationId 
    ? mockMembers.filter(m => m.assignedLocationId === selectedLocationId)
    : mockMembers;

  const activeMembers = locationMembers.filter((m) => m.status === 'Active').length;
  const totalMembers = locationMembers.length;

  const tenantLocations = user?.tenantId ? getLocationsByTenant(user.tenantId) : [];

  /* MEMBER DASHBOARD VIEW */
  if (user?.role === UserRole.Member) {
      const currentMember = mockMembers.find(m => m.email === user.email) || mockMembers[0];
      
      const mockRoutine = {
        name: "Fuerza e Hipertrofia",
        description: "Enfoque en pecho y tríceps (Día 1)",
        items: [
          { name: "Press de Banca", sets: 4, reps: "8-10", notes: "Controlar el descenso" },
          { name: "Aperturas con Mancuernas", sets: 3, reps: "12", notes: "Máximo estiramiento" },
          { name: "Press Francés", sets: 4, reps: "10", notes: "Codos cerrados" },
          { name: "Extensiones en Polea", sets: 3, reps: "15", notes: "Sostener 1s abajo" },
        ]
      };

      const attendanceStats = {
        monthlyCount: 12,
        streak: 5,
        lastVisit: "Ayer"
      };

      return (
          <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight">¡Hola, {user.name}! 💪</h1>
                <div className="flex items-center gap-2">
                   <Badge variant="outline" className="bg-blue-50 text-blue-700">Miembro Premium</Badge>
                   <Badge variant="outline" className="bg-green-50 text-green-700">Cuota al día</Badge>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-12">
                  {/* LEFT COLUMN - PROFILE & ATTENDANCE */}
                  <div className="md:col-span-4 space-y-6">
                      <MemberProfile member={currentMember} />
                      <MemberAttendance stats={attendanceStats} />
                      <MemberProgress />
                      <MemberDocs />
                  </div>

                  {/* MIDDLE COLUMN - ROUTINE & INTERACTIVE */}
                  <div className="md:col-span-5 space-y-6">
                      <MemberTimer />
                      <MemberRoutineView routine={mockRoutine} />
                      <MemberNotes />
                  </div>

                  {/* RIGHT COLUMN - CLASSES & INFO */}
                  <div className="md:col-span-3 space-y-6">
                      <MemberClasses />
                      <MessageList />
                      
                      {/* QUICK HELP */}
                      <Card className="bg-blue-600 text-white border-none">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white text-sm">¿Necesitás ayuda?</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-blue-100 mb-4">Contactate con recepción o con tu entrenador asignado.</p>
                          <Button variant="secondary" size="sm" className="w-full text-blue-600 font-bold">
                            Chatear con el Gym
                          </Button>
                        </CardContent>
                      </Card>
                  </div>
              </div>
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

              {isFeatureEnabled(user.tenantId || '', 'ai_insights') && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                             AI Insights
                        </CardTitle>
                        <BrainCircuit className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12%</div>
                        <p className="text-xs text-muted-foreground">
                            Crecimiento proyectado (IA)
                        </p>
                    </CardContent>
                </Card>
              )}
          </div>

          {/* QUICK ACTIONS & RECENT */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 lg:col-span-4">
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
              
              <div className="col-span-3 space-y-4">
                <Card>
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

                <SendMessageForm />
                <MessageList limit={3}/>
              </div>
          </div>
        </div>
      </RoleGuard>
    );
  }

  /* ADMIN TENANT / TRAINER / STAFF - SINGLE GYM MANAGEMENT VIEW */
  return (
    <RoleGuard allowedRoles={[UserRole.AdminTenant, UserRole.Trainer, UserRole.Staff]}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Resumen del Panel</h1>
              <p className="text-sm text-muted-foreground">Bienvenido de nuevo, {user?.name}</p>
            </div>
            
            {tenantLocations.length > 0 && (
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Select 
                  value={selectedLocationId || 'all'} 
                  onValueChange={(v) => setSelectedLocationId(v === 'all' ? null : v)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Todas las sucursales" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las sucursales</SelectItem>
                    {tenantLocations.map(loc => (
                      <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
                        {locationMembers.slice(0, 5).map(member => (
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
            
            <div className="col-span-3 space-y-4">
                <Card>
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
                              <Link href="/dashboard/payments">
                                  <CreditCard className="mr-2 h-4 w-4" /> Pagos
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

                <SendMessageForm />
                <MessageList limit={3} />
            </div>
        </div>
      </div>
    </RoleGuard>
  );
}
