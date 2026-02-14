'use client';

import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/contracts';
import { mockCheckIns } from '@/data/access';
import { Button } from '@/components/ui/button';
import { QrCode, Search, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function AccessPage() {
    return (
        <RoleGuard allowedRoles={[UserRole.AdminTenant, UserRole.Staff]}>
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Control de Acceso</h1>
                        <p className="text-muted-foreground">Monitoreo de ingresos en tiempo real.</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* SIMULATION PANEL */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Simulador de Ingreso</CardTitle>
                             <CardDescription>Escanea un código QR o ingresa un DNI manualmente.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input placeholder="DNI del Socio..." />
                                <Button>
                                    <Search className="mr-2 h-4 w-4" /> Buscar
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Button className="w-full h-24 flex-col text-lg" variant="outline" onClick={() => alert("Simulating QR Scan...")}>
                                    <QrCode className="mb-2 h-8 w-8" />
                                    Escanear QR
                                </Button>
                            </div>
                            
                            {/* DEMO RESULT (Static) */}
                            <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-4">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <UserCheck className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-green-800">Acceso Permitido</h3>
                                    <p className="text-green-700 text-sm">Carlos Socio - Cuota al día</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* RECENT ACCESS TABLE */}
                    <Card>
                         <CardHeader>
                            <CardTitle>Últimos Ingresos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Hora</TableHead>
                                        <TableHead>Socio</TableHead>
                                        <TableHead>Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockCheckIns.map((checkin) => (
                                        <TableRow key={checkin.id}>
                                            <TableCell>
                                                {format(checkin.timestamp, 'HH:mm')}
                                            </TableCell>
                                            <TableCell>
                                                {checkin.memberName}
                                                <div className="text-xs text-muted-foreground">{checkin.type}</div>
                                            </TableCell>
                                            <TableCell>
                                                 {checkin.status === 'Allowed' ? (
                                                     <Badge variant="default" className="bg-green-600">Permitido</Badge>
                                                 ) : (
                                                     <Badge variant="destructive">Denegado</Badge>
                                                 )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </RoleGuard>
    );
}
