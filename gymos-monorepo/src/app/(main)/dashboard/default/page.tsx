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
import { WidgetGrid } from '../_components/widgets/widget-grid';
import { ChatWithGymModal } from '../_components/messaging/chat-modal';

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
      return (
          <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight">¡Hola, {user.name}! 💪</h1>
                <div className="flex items-center gap-2">
                   <Badge variant="outline" className="bg-blue-50 text-blue-700">Miembro Premium</Badge>
                   <Badge variant="outline" className="bg-green-50 text-green-700">Cuota al día</Badge>
                </div>
              </div>
              
              <WidgetGrid role={UserRole.Member} />

              {/* HELP CARD - FIXED AT BOTTOM OR AS WIDGET LATER */}
              <div className="grid gap-6 md:grid-cols-12">
                  <div className="md:col-start-10 md:col-span-3">
                      <Card className="bg-blue-600 text-white border-none">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white text-sm">¿Necesitás ayuda?</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-blue-100 mb-4">Contactate con recepción o con tu entrenador asignado.</p>
                          <ChatWithGymModal>
                            <Button variant="secondary" size="sm" className="w-full text-blue-600 font-bold">
                                Chatear con el Gym
                            </Button>
                          </ChatWithGymModal>
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
              <h1 className="text-2xl font-bold tracking-tight">Panel de Administración Global</h1>
          </div>

          <WidgetGrid role={UserRole.AdminGlobal} />
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
              <h1 className="text-2xl font-bold tracking-tight">Panel de Control</h1>
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

        <WidgetGrid role={user?.role || UserRole.Staff} />
      </div>
    </RoleGuard>
  );
}
