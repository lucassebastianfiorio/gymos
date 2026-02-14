'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addExercise, updateExercise, mockExercises } from '@/data/routines';

interface CreateExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exerciseId?: string | null;
  onExerciseCreated?: () => void;
}

const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Cardio', 'Core'] as const;

const MUSCLE_GROUP_LABELS: Record<typeof MUSCLE_GROUPS[number], string> = {
  'Chest': 'Pecho',
  'Back': 'Espalda',
  'Legs': 'Piernas',
  'Arms': 'Brazos',
  'Shoulders': 'Hombros',
  'Cardio': 'Cardio',
  'Core': 'Core'
};

export function CreateExerciseDialog({ 
  open, 
  onOpenChange, 
  exerciseId,
  onExerciseCreated 
}: CreateExerciseDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<typeof MUSCLE_GROUPS[number]>('Chest');

  const isEditing = !!exerciseId;

  useEffect(() => {
    if (open && exerciseId) {
      const exercise = mockExercises.find(e => e.id === exerciseId);
      if (exercise) {
        setName(exercise.name);
        setDescription(exercise.description);
        setMuscleGroup(exercise.muscleGroup);
      }
    } else if (open && !exerciseId) {
      // Reset for new exercise
      setName('');
      setDescription('');
      setMuscleGroup('Chest');
    }
  }, [open, exerciseId]);

  const handleSave = () => {
    if (!name.trim()) {
      alert('Por favor ingresa un nombre para el ejercicio');
      return;
    }

    if (isEditing && exerciseId) {
      updateExercise(exerciseId, {
        name: name.trim(),
        description: description.trim(),
        muscleGroup,
      });
    } else {
      addExercise({
        name: name.trim(),
        description: description.trim(),
        muscleGroup,
      });
    }

    // Reset form
    setName('');
    setDescription('');
    setMuscleGroup('Chest');
    
    onOpenChange(false);
    onExerciseCreated?.();
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setMuscleGroup('Chest');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar' : 'Crear'} Ejercicio</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifica' : 'Define'} los detalles del ejercicio.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              placeholder="Ej: Press de Banca"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="muscleGroup">Grupo Muscular *</Label>
            <Select value={muscleGroup} onValueChange={(value: any) => setMuscleGroup(value)}>
              <SelectTrigger id="muscleGroup">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MUSCLE_GROUPS.map(group => (
                  <SelectItem key={group} value={group}>{MUSCLE_GROUP_LABELS[group]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe la técnica o variación..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? 'Guardar Cambios' : 'Crear Ejercicio'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
