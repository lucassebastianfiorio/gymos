'use client';

import { useState } from 'react';
import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/contracts';
import { mockRoutines, mockExercises } from '@/data/routines';
import { Button } from '@/components/ui/button';
import { Plus, Dumbbell, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CreateRoutineDialog } from './_components/create-routine-dialog';

export default function RoutinesManagePage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRoutineCreated = () => {
        setRefreshKey(prev => prev + 1); // Force re-render to show new routine
    };

    return (
        <RoleGuard allowedRoles={[UserRole.AdminTenant, UserRole.Trainer]}>
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gestión de Rutinas</h1>
                        <p className="text-muted-foreground">Crea plantillas de rutinas y asígnalas a los miembros.</p>
                    </div>
                    <Button onClick={() => setDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Crear Rutina
                    </Button>
                </div>

                <div key={refreshKey} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {mockRoutines.map((routine) => (
                        <Card key={routine.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl">{routine.name}</CardTitle>
                                    <Badge variant={routine.difficulty === 'Beginner' ? 'default' : 'secondary'}>
                                        {routine.difficulty}
                                    </Badge>
                                </div>
                                <CardDescription>{routine.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <h4 className="text-sm font-semibold mb-2 flex items-center">
                                    <Dumbbell className="mr-2 h-3 w-3" /> Ejercicios ({routine.items.length})
                                </h4>
                                <ScrollArea className="h-[150px] w-full rounded-md border p-4">
                                    <ul className="space-y-2 text-sm">
                                        {routine.items.map((item, index) => {
                                            const exercise = mockExercises.find(e => e.id === item.exerciseId);
                                            return (
                                                <li key={index} className="flex justify-between items-center border-b pb-1 last:border-0">
                                                    <span>{exercise?.name || 'Unknown'}</span>
                                                    <span className="text-muted-foreground text-xs">
                                                        {item.sets} x {item.reps}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </ScrollArea>
                            </CardContent>
                            <CardFooter className="flex gap-2 pt-4">
                                 <Button variant="outline" className="flex-1" onClick={() => alert(`Edit ${routine.name}`)}>
                                    Editar
                                </Button>
                                <Button className="flex-1" onClick={() => alert(`Assign ${routine.name} to Member`)}>
                                    Asignar a Socio
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <CreateRoutineDialog 
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onRoutineCreated={handleRoutineCreated}
                />
            </div>
        </RoleGuard>
    );
}
