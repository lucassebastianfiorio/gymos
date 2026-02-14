'use client';

import { useState } from 'react';
import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/contracts';
import { mockExercises, deleteExercise } from '@/data/routines';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { CreateExerciseDialog } from '@/app/(main)/dashboard/exercises/_components/create-exercise-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const MUSCLE_GROUP_LABELS: Record<string, string> = {
  'Chest': 'Pecho',
  'Back': 'Espalda',
  'Legs': 'Piernas',
  'Arms': 'Brazos',
  'Shoulders': 'Hombros',
  'Cardio': 'Cardio',
  'Core': 'Core'
};

export default function ExercisesPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleExerciseCreated = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleEdit = (exerciseId: string) => {
        setEditingExercise(exerciseId);
        setDialogOpen(true);
    };

    const handleDelete = (exerciseId: string) => {
        if (confirm('¿Estás seguro de eliminar este ejercicio?')) {
            const success = deleteExercise(exerciseId);
            if (success) {
                setRefreshKey(prev => prev + 1);
            } else {
                alert('No se puede eliminar: el ejercicio está siendo usado en rutinas activas');
            }
        }
    };

    const handleDialogClose = (open: boolean) => {
        setDialogOpen(open);
        if (!open) {
            setEditingExercise(null);
        }
    };

    return (
        <RoleGuard allowedRoles={[UserRole.AdminTenant, UserRole.Trainer]}>
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gestión de Ejercicios</h1>
                        <p className="text-muted-foreground">
                            Administra el catálogo de ejercicios disponibles para las rutinas.
                        </p>
                    </div>
                    <Button onClick={() => { setEditingExercise(null); setDialogOpen(true); }}>
                        <Plus className="mr-2 h-4 w-4" /> Crear Ejercicio
                    </Button>
                </div>

                <div key={refreshKey} className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Grupo Muscular</TableHead>
                                <TableHead className="max-w-md">Descripción</TableHead>
                                <TableHead className="text-right w-[120px]">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockExercises.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                        No hay ejercicios registrados. Crea uno para comenzar.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                mockExercises.map((exercise) => (
                                    <TableRow key={exercise.id}>
                                        <TableCell className="font-medium">{exercise.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{MUSCLE_GROUP_LABELS[exercise.muscleGroup] || exercise.muscleGroup}</Badge>
                                        </TableCell>
                                        <TableCell className="max-w-md truncate">
                                            {exercise.description || <span className="text-muted-foreground">Sin descripción</span>}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(exercise.id)}
                                                    title="Editar ejercicio"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(exercise.id)}
                                                    title="Eliminar ejercicio"
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <CreateExerciseDialog
                    open={dialogOpen}
                    onOpenChange={handleDialogClose}
                    exerciseId={editingExercise}
                    onExerciseCreated={handleExerciseCreated}
                />
            </div>
        </RoleGuard>
    );
}
