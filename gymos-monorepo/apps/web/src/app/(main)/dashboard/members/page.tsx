'use client';

import { useState } from 'react';
import { UserRole, Member } from '@gymos/contracts';
import { RoleGuard } from '@/components/auth/role-guard';
import { MembersTable } from './_components/members-table';
import { MemberForm } from './_components/member-form';
import { mockMembers } from '@/data/members';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export default function MembersPage() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<Member | null>(null);

    const handleEdit = (member: Member) => {
        setEditingMember(member);
        setIsSheetOpen(true);
    };

    const handleCreate = () => {
        setEditingMember(null);
        setIsSheetOpen(true);
    };

    const onSubmit = (values: any) => {
        console.log("Submit:", values);
        setIsSheetOpen(false);
        // Aquí iría la lógica real de mutación
    };

    return (
        <RoleGuard allowedRoles={[UserRole.AdminTenant, UserRole.Trainer, UserRole.Staff]}>
            <div className="flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Gestión de Miembros</h1>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Nuevos Miembro
                    </Button>
                </div>

                <MembersTable data={mockMembers} onEdit={handleEdit} />

                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>{editingMember ? 'Editar Miembro' : 'Registrar Nuevo Miembro'}</SheetTitle>
                            <SheetDescription>
                                {editingMember ? 'Actualiza los datos del miembro.' : 'Completa el formulario para dar de alta un nuevo miembro.'}
                            </SheetDescription>
                        </SheetHeader>
                        <div className="py-4">
                            <MemberForm defaultValues={editingMember || undefined} onSubmit={onSubmit} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </RoleGuard>
    )
}
