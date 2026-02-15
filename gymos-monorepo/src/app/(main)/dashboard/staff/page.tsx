'use client';

import { useState } from 'react';
import { UserRole, Staff } from '@/contracts';
import { RoleGuard } from '@/components/auth/role-guard';
import { mockStaff, getStaffByTenant } from '@/data/staff';
import { mockLocations } from '@/data/locations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Mail, Clock, Trophy, MapPin, Pencil, LayoutGrid, List } from 'lucide-react';
import { EditStaffDialog } from './_components/edit-staff-dialog';
import { StaffTable } from './_components/staff-table';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

export default function StaffPage() {
    const [staffList, setStaffList] = useState<Staff[]>(mockStaff);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [searchTerm, setSearchTerm] = useState("");

    const handleEdit = (staff: Staff) => {
        setEditingStaff(staff);
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingStaff(null);
        setIsDialogOpen(true);
    };

    const handleSubmit = (data: any) => {
        if (editingStaff) {
             setStaffList(staffList.map(s => s.id === editingStaff.id ? { ...s, ...data } : s));
             toast.success("Personal actualizado");
        } else {
            const newStaff: Staff = {
                id: `staff_${Date.now()}`,
                userId: `user_${Date.now()}`,
                tenantId: "tenant_1",
                isActive: true, // Default to active
                avatarUrl: "/avatars/01.png", // Default avatar
                schedule: "9:00 AM - 5:00 PM", // Default schedule
                rating: 5,
                ...data
            };
            setStaffList([...staffList, newStaff]);
            toast.success("Personal agregado");
        }
        setIsDialogOpen(false);
    };

    const getLocationNames = (ids?: string[]) => {
        if (!ids || ids.length === 0) return ["Sin asignación"];
        return ids.map(id => mockLocations.find(l => l.id === id)?.name || id);
    };

  return (
    <RoleGuard allowedRoles={[UserRole.AdminTenant]}>
       <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                     <h1 className="text-3xl font-bold tracking-tight">Personal & Staff</h1>
                     <p className="text-muted-foreground">Gestiona tu equipo y sus asignaciones.</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Agregar Personal
                </Button>
            </div>

            <div className="flex items-center justify-between gap-4">
                <Input 
                    placeholder="Buscar por nombre, email o especialidad..." 
                    className="max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex items-center border rounded-md p-1 bg-muted/50">
                    <Button 
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => setViewMode('table')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {staffList
                        .filter(s => 
                            s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            s.specialties.some(sp => sp.toLowerCase().includes(searchTerm.toLowerCase()))
                        )
                        .map(staff => (
                    <Card key={staff.id} className="overflow-hidden flex flex-col">
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
                        <CardContent className="space-y-3 text-sm flex-1">
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
                            
                            <div className="flex items-start justify-between">
                                <span className="text-muted-foreground flex items-center gap-2 mt-0.5">
                                    <MapPin className="h-3 w-3" /> Sedes
                                </span>
                                <div className="flex gap-1 flex-wrap justify-end max-w-[60%]">
                                     {getLocationNames(staff.assignedLocationIds).map(loc => (
                                        <Badge key={loc} variant="outline" className="text-[10px] px-1 py-0">{loc}</Badge>
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
                            <Badge variant={staff.role === UserRole.AdminTenant ? "default" : "secondary"}>
                                {staff.role}
                            </Badge>
                             <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(staff)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                             </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            ) : (
                <StaffTable 
                    data={staffList.filter(s => 
                        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        s.email.toLowerCase().includes(searchTerm.toLowerCase())
                    )} 
                    onEdit={handleEdit} 
                />
            )}

            <EditStaffDialog 
                open={isDialogOpen} 
                onOpenChange={setIsDialogOpen} 
                staff={editingStaff} 
                onSubmit={handleSubmit}
            />
       </div>
    </RoleGuard>
  );
}
