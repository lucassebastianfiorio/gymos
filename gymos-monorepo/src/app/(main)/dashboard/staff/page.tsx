'use client';

import { UserRole } from '@/contracts';
import { RoleGuard } from '@/components/auth/role-guard';
import { mockStaff } from '@/data/staff';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Mail, Clock, Trophy } from 'lucide-react';

export default function StaffPage() {
  return (
    <RoleGuard allowedRoles={[UserRole.AdminTenant]}>
       <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Personal & Staff</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Agregar Staff
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {mockStaff.map(staff => (
                    <Card key={staff.id} className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                             <Avatar className="h-12 w-12">
                                <AvatarImage src={staff.avatarUrl} />
                                <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <CardTitle className="text-base">{staff.name}</CardTitle>
                                <CardDescription className="text-xs">{staff.email}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Trophy className="h-3 w-3" /> Especialidad
                                </span>
                                <div className="flex gap-1 flex-wrap justify-end">
                                    {staff.specialties.map(spec => (
                                        <Badge key={spec} variant="secondary" className="text-[10px] px-1 py-0">{spec}</Badge>
                                    ))}
                                </div>
                            </div>
                            {staff.schedule && (
                                <div className="flex items-start justify-between">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Clock className="h-3 w-3" /> Horario
                                    </span>
                                    <span className="text-right font-medium text-xs">{staff.schedule}</span>
                                </div>
                            )}
                             <div className="pt-2 border-t mt-2">
                                <span className="text-xs text-muted-foreground italic line-clamp-2">
                                    "{staff.bio || 'Sin biografía'}"
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/50 p-3 flex justify-between items-center">
                            <Badge variant="outline">{staff.role}</Badge>
                             <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Mail className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
       </div>
    </RoleGuard>
  );
}
