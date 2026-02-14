'use client';

import { Payment } from '@/contracts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface FinanceMetricsProps {
    payments: Payment[];
}

export function FinanceMetrics({ payments }: FinanceMetricsProps) {
    const totalIncome = payments
        .filter(p => p.status === 'Paid')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const pendingAmount = payments
        .filter(p => p.status === 'Pending')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const overdueCount = payments.filter(p => p.status === 'Overdue').length;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                    <Banknote className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Pagos confirmados este mes</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Por Cobrar</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Pagos pendientes de aprobación</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Morosidad</CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overdueCount}</div>
                    <p className="text-xs text-muted-foreground">Pagos vencidos</p>
                </CardContent>
            </Card>
        </div>
    );
}
