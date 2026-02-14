'use client';

import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/contracts';
import { useAuthStore } from '@/lib/auth/store';
import { mockPayments } from '@/data/payments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Banknote, AlertCircle, CheckCircle } from 'lucide-react';

export default function MemberPaymentsPage() {
    const { user } = useAuthStore();
    const memberId = user?.email.startsWith('member') ? 'member_1' : user?.id;

    const myPayments = mockPayments.filter(p => p.memberId === memberId).sort((a, b) => b.date.getTime() - a.date.getTime());
    
    // Calculate status
    const hasOverdue = myPayments.some(p => p.status === 'Overdue');
    const lastPayment = myPayments.find(p => p.status === 'Paid');

    return (
        <RoleGuard allowedRoles={[UserRole.Member]}>
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Mis Pagos</h1>
                        <p className="text-muted-foreground">Historial de cuotas y estado de cuenta.</p>
                    </div>
                </div>

                {/* STATUS CARDS */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className={hasOverdue ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                {hasOverdue ? <AlertCircle className="h-4 w-4 text-red-600" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
                                Estado de Cuenta
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${hasOverdue ? "text-red-700" : "text-green-700"}`}>
                                {hasOverdue ? "Pagos Pendientes" : "Al Día"}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {hasOverdue ? "Por favor regulariza tu situación." : "¡Gracias por tu pago!"}
                            </p>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Banknote className="h-4 w-4 text-blue-600" />
                                Último Pago
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {lastPayment ? `$${lastPayment.amount}` : '-'}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {lastPayment ? format(lastPayment.date, 'dd/MM/yyyy') : 'No registrado'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* HISTORY TABLE */}
                <Card>
                    <CardHeader>
                        <CardTitle>Historial</CardTitle>
                        <CardDescription>Detalle de tus últimos movimientos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Concepto</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead>Método</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {myPayments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            {format(payment.date, 'dd/MM/yyyy')}
                                        </TableCell>
                                        <TableCell>{payment.concept}</TableCell>
                                        <TableCell>{payment.currency} {payment.amount.toFixed(2)}</TableCell>
                                        <TableCell>{payment.method}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                payment.status === 'Paid' ? 'default' : 
                                                payment.status === 'Overdue' ? 'destructive' : 'secondary'
                                            }>
                                                {payment.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </RoleGuard>
    );
}
