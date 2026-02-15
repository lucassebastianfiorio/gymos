'use client';

import { useState } from 'react';
import { UserRole, Member } from '@/contracts';
import { RoleGuard } from '@/components/auth/role-guard';
import { MembersTable } from './_components/members-table';
import { MemberForm } from './_components/member-form';
import { MemberPaymentHistory } from './_components/member-payment-history';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

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
        // En una app real, actualizaríamos el estado 'members' o invalidaríamos la query
    };

    return (
        <RoleGuard allowedRoles={[UserRole.AdminTenant, UserRole.Trainer, UserRole.Staff]}>
            <div className="flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Gestión de Miembros</h1>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Miembro
                    </Button>
                </div>

                <MembersTable data={mockMembers} onEdit={handleEdit} />

                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetContent className="sm:max-w-[600px] overflow-y-auto">
                        <SheetHeader className="mb-4">
                            <SheetTitle>{editingMember ? 'Editar Miembro' : 'Registrar Nuevo Miembro'}</SheetTitle>
                            <SheetDescription>
                                {editingMember ? 'Gestiona la información y pagos del miembro.' : 'Completa el formulario para dar de alta un nuevo miembro.'}
                            </SheetDescription>
                        </SheetHeader>
                        
                        {editingMember ? (
                             <Tabs defaultValue="details" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="details">Datos Personales</TabsTrigger>
                                    <TabsTrigger value="payments">Historial de Pagos</TabsTrigger>
                                </TabsList>
                                <TabsContent value="details" className="mt-4">
                                     <MemberForm defaultValues={editingMember} onSubmit={onSubmit} />
                                </TabsContent>
                                <TabsContent value="payments" className="mt-4">
                                    <MemberPaymentHistory memberId={editingMember.id} />
                                </TabsContent>
                            </Tabs>
                        ) : (
                            <MemberForm onSubmit={onSubmit} />
                        )}
                    </SheetContent>
                </Sheet>
            </div>
        </RoleGuard>
    )
}
