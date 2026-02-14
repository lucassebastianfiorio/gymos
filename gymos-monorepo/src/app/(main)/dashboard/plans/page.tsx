'use client';

import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/contracts';
import { mockPlans } from '@/data/plans';
import { useState } from 'react';
import { PlansTable } from './_components/plans-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PlansPage() {
    const [plans, setPlans] = useState(mockPlans);

    const handleCreate = () => {
        alert("Create Plan Modal - To be implemented");
    };

    const handleEdit = (plan: any) => {
        alert(`Edit Plan ${plan.name} - To be implemented`);
    };

    const handleDelete = (id: string) => {
        if(confirm("Are you sure you want to delete this plan?")) {
            setPlans(plans.filter(p => p.id !== id));
        }
    };

    return (
        <RoleGuard allowedRoles={[UserRole.AdminGlobal]}>
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Planes de Suscripción</h1>
                        <p className="text-muted-foreground">Gestiona los planes disponibles para los gimnasios (Tenants).</p>
                    </div>
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" /> Crear Plan
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Planes</CardTitle>
                        <CardDescription>Configura los límites y precios de cada nivel de servicio.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PlansTable data={plans} onEdit={handleEdit} onDelete={handleDelete} />
                    </CardContent>
                </Card>
            </div>
        </RoleGuard>
    );
}
