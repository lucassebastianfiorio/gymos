'use client';

import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/contracts';
import { useAuthStore } from '@/lib/auth/store';
import { mockAssignedRoutines, mockRoutines, mockExercises } from '@/data/routines';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Dumbbell, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function MemberRoutinesPage() {
    const { user } = useAuthStore();

    // 1. Find active assignment for this user (or mock 'member_1' if user ID doesn't match mock)
    // In a real app, we would use user.id. Here we fallback to 'member_1' for the demo if the logged in user is the mock member.
    const memberId = user?.email.startsWith('member') ? 'member_1' : user?.id;
    
    const assignment = mockAssignedRoutines.find(a => a.memberId === memberId && a.active);
    const routine = assignment ? mockRoutines.find(r => r.id === assignment.routineId) : null;

    return (
        <RoleGuard allowedRoles={[UserRole.Member]}>
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Mi Rutina</h1>
                        <p className="text-muted-foreground">Tu plan de entrenamiento actual.</p>
                    </div>
                </div>

                {routine ? (
                    <div className="grid gap-6">
                         <Card>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-2xl">{routine.name}</CardTitle>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>Asignada el {format(assignment!.assignedAt, 'dd/MM/yyyy')}</span>
                                        </div>
                                    </div>
                                    <Badge className="text-lg px-4 py-1">
                                        {routine.difficulty}
                                    </Badge>
                                </div>
                                <CardDescription className="mt-4 text-base">
                                    {routine.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                             {routine.items.map((item, index) => {
                                const exercise = mockExercises.find(e => e.id === item.exerciseId);
                                return (
                                    <Card key={index} className="overflow-hidden">
                                        <div className="h-2 bg-blue-600 w-full" />
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">{exercise?.name}</CardTitle>
                                            <CardDescription>{exercise?.muscleGroup}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4 mt-2">
                                                <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
                                                    <span className="text-2xl font-bold">{item.sets}</span>
                                                    <span className="text-xs text-muted-foreground uppercase">Series</span>
                                                </div>
                                                <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
                                                    <span className="text-2xl font-bold">{item.reps}</span>
                                                    <span className="text-xs text-muted-foreground uppercase">Reps</span>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground bg-secondary/20 p-2 rounded">
                                                <Clock className="h-4 w-4" />
                                                <span>Descanso: {item.restSeconds}s</span>
                                            </div>

                                            {item.notes && (
                                                <div className="mt-4 text-sm bg-yellow-50 text-yellow-800 p-2 rounded border border-yellow-100">
                                                    📝 {item.notes}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center h-[300px] text-center">
                            <Dumbbell className="h-16 w-16 text-muted-foreground mb-4" />
                            <h2 className="text-xl font-semibold">No tienes una rutina asignada</h2>
                            <p className="text-muted-foreground mt-2 max-w-sm">
                                Acércate a un entrenador para que diseñe un plan personalizado para ti.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </RoleGuard>
    );
}
