'use client';

import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole, Tenant } from '@/contracts';
import { TenantsTable } from './_components/tenants-table';
import { mockTenants } from '@/data/tenants';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { TenantForm } from "./_components/tenant-form";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

export default function TenantsPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | undefined>(undefined);

  const handleCreateTenant = (values: any) => {
      console.log("Create/Update Tenant:", values);
      alert(editingTenant ? "Tenant updated (Mock)" : "Tenant created (Mock)");
      setIsSheetOpen(false);
      setEditingTenant(undefined);
  };

  const openCreate = () => {
      setEditingTenant(undefined);
      setIsSheetOpen(true);
  }

  const openEdit = (tenant: Tenant) => {
      setEditingTenant(tenant);
      setIsSheetOpen(true);
  }

  return (
    <RoleGuard allowedRoles={[UserRole.AdminGlobal]}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Gestión de Sedes (Tenants)</h1>
             <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <Button onClick={openCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Agregar Sede
                </Button>
                <SheetContent>
                    <SheetHeader>
                    <SheetTitle>{editingTenant ? 'Editar Sede' : 'Agregar Nueva Sede'}</SheetTitle>
                    <SheetDescription>
                        {editingTenant ? `Actualizar detalles para ${editingTenant.name}` : 'Crear una nueva sede en la plataforma.'}
                    </SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                        {/* We pass a key to force re-render when switching between add/edit or different tenants */}
                        <TenantForm 
                            key={editingTenant ? editingTenant.id : 'new'}
                            defaultValues={editingTenant} 
                            onSubmit={handleCreateTenant} 
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
        <TenantsTable data={mockTenants} onEdit={openEdit} />
      </div>
    </RoleGuard>
  );
}
