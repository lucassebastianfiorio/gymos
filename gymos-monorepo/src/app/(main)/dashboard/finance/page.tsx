'use client';

import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/contracts';
import { mockPayments } from '@/data/payments';
import { FinanceMetrics } from './_components/finance-metrics';
import { PaymentsTable } from './_components/payments-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FinancePage() {
    return (
        <RoleGuard allowedRoles={[UserRole.AdminTenant]}>
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Finanzas</h1>
                        <p className="text-muted-foreground">Gestiona los ingresos, pagos y caja del gimnasio.</p>
                    </div>
                    <Button onClick={() => alert("New Payment Modal - To be implemented")}>
                        <Plus className="mr-2 h-4 w-4" /> Registrar Pago
                    </Button>
                </div>

                <FinanceMetrics payments={mockPayments} />

                <Card>
                    <CardHeader>
                        <CardTitle>Historial de Transacciones</CardTitle>
                        <CardDescription>Últimos movimientos registrados.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PaymentsTable data={mockPayments} />
                    </CardContent>
                </Card>
            </div>
        </RoleGuard>
    );
}
