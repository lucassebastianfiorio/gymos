'use client';

import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/contracts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, TrendingUp, Scale } from 'lucide-react';

const mockProgress = [
    { date: "2026-02-01", weight: 80.5, bodyFat: 18.2, notes: "Inicio de mes" },
    { date: "2026-01-15", weight: 81.2, bodyFat: 18.5, notes: "" },
    { date: "2026-01-01", weight: 82.0, bodyFat: 19.0, notes: "Post fiestas" },
];

export default function MemberProgressPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.Member]}>
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Mi Progreso</h1>
                        <p className="text-muted-foreground">Seguimiento de tu evolución física.</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Peso Actual</CardTitle>
                            <Scale className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockProgress[0].weight} kg</div>
                            <p className="text-xs text-muted-foreground">
                                -1.5kg desde el mes pasado
                            </p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Grasa Corporal</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockProgress[0].bodyFat}%</div>
                            <p className="text-xs text-muted-foreground">
                                -0.8% desde el mes pasado
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Historial de Medidas</CardTitle>
                        <CardDescription>Registro histórico de peso y composición corporal.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Peso (kg)</TableHead>
                                    <TableHead>Grasa (%)</TableHead>
                                    <TableHead>Notas</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockProgress.map((entry, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{entry.date}</TableCell>
                                        <TableCell>{entry.weight}</TableCell>
                                        <TableCell>{entry.bodyFat}</TableCell>
                                        <TableCell>{entry.notes}</TableCell>
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
