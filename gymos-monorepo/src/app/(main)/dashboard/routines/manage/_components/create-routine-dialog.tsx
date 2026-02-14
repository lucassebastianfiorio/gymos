'use client';

import { useState } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Search } from 'lucide-react';
import { mockExercises, addRoutine, addAssignedRoutine } from '@/data/routines';
import { mockMembers } from '@/data/members';
import { RoutineItem } from '@/contracts';
import { useAuthStore } from '@/lib/auth/store';
import { Checkbox } from '@/components/ui/checkbox';

interface CreateRoutineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRoutineCreated?: () => void;
}

export function CreateRoutineDialog({ open, onOpenChange, onRoutineCreated }: CreateRoutineDialogProps) {
  const { user } = useAuthStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [items, setItems] = useState<RoutineItem[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  
  // State for adding new exercise
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [rest, setRest] = useState('60');

  // Filter exercises based on search
  const filteredExercises = mockExercises.filter(ex => 
    ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
    ex.muscleGroup.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  const handleAddExercise = () => {
    if (!selectedExercise) return;
    
    const newItem: RoutineItem = {
      exerciseId: selectedExercise,
      sets: parseInt(sets) || 3,
      reps: reps || '10',
      restSeconds: parseInt(rest) || 60,
    };
    
    setItems([...items, newItem]);
    // Reset form
    setSelectedExercise('');
    setExerciseSearch('');
    setSets('3');
    setReps('10');
    setRest('60');
  };

  const handleRemoveExercise = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Por favor ingresa un nombre para la rutina');
      return;
    }
    
    if (items.length === 0) {
      alert('Por favor añade al menos un ejercicio');
      return;
    }

    const newRoutine = addRoutine({
      name: name.trim(),
      description: description.trim(),
      difficulty,
      items,
      tenantId: user?.tenantId || 'tenant_1',
    });

    // Auto-assign to selected members
    selectedMembers.forEach(memberId => {
      addAssignedRoutine({
        memberId,
        routineId: newRoutine.id,
        assignedBy: user?.id || 'trainer_1',
        assignedAt: new Date(),
        active: true
      });
    });

    // Reset form
    setName('');
    setDescription('');
    setDifficulty('Beginner');
    setItems([]);
    setSelectedMembers([]);
    
    onOpenChange(false);
    onRoutineCreated?.();
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setDifficulty('Beginner');
    setItems([]);
    setSelectedMembers([]);
    setExerciseSearch('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <DialogTitle>Crear Nueva Rutina</DialogTitle>
          <DialogDescription>
            Define los detalles de la rutina y añade los ejercicios que la componen.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 overflow-auto px-6">
          <div className="space-y-6 py-4 pb-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  placeholder="Ej: Full Body A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe el objetivo de esta rutina..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificultad</Label>
                <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                  <SelectTrigger id="difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Principiante</SelectItem>
                    <SelectItem value="Intermediate">Intermedio</SelectItem>
                    <SelectItem value="Advanced">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Exercises Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Ejercicios ({items.length})</Label>
              </div>

              {/* Added Exercises List */}
              {items.length > 0 && (
                <div className="space-y-2 border rounded-lg p-4 bg-muted/30">
                  {items.map((item, index) => {
                    const exercise = mockExercises.find(e => e.id === item.exerciseId);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-background rounded-md border">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{exercise?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.sets} sets × {item.reps} reps • {item.restSeconds}s descanso
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveExercise(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add Exercise Form */}
              <div className="border rounded-lg p-4 space-y-4">
                <Label className="text-sm font-semibold">Añadir Ejercicio</Label>
                
                <div className="space-y-4">
                  {/* Search Input */}
                  <div className="space-y-2">
<Label htmlFor="exercise-search" className="text-xs">Buscar Ejercicio</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="exercise-search"
                        placeholder="Buscar por nombre o grupo muscular..."
                        value={exerciseSearch}
                        onChange={(e) => setExerciseSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  {/* Exercise Select */}
                  <div className="space-y-2">
                    <Label htmlFor="exercise" className="text-xs">Seleccionar</Label>
                    <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                      <SelectTrigger id="exercise">
                        <SelectValue placeholder="Selecciona un ejercicio" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredExercises.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            No se encontraron ejercicios
                          </div>
                        ) : (
                          filteredExercises.map((exercise) => (
                            <SelectItem key={exercise.id} value={exercise.id}>
                              {exercise.name} - {exercise.muscleGroup}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="sets" className="text-xs">Series</Label>
                      <Input
                        id="sets"
                        type="number"
                        min="1"
                        value={sets}
                        onChange={(e) => setSets(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reps" className="text-xs">Repeticiones</Label>
                      <Input
                        id="reps"
                        placeholder="10 o 10-12"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rest" className="text-xs">Descanso (s)</Label>
                      <Input
                        id="rest"
                        type="number"
                        min="0"
                        value={rest}
                        onChange={(e) => setRest(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleAddExercise}
                  disabled={!selectedExercise}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir a la Rutina
                </Button>
              </div>
            </div>

            {/* Members Assignment (Optional) */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Asignar a Miembros (Opcional)</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Selecciona los miembros que recibirán esta rutina automáticamente
                </p>
              </div>
              
              <div className="border rounded-lg p-4 max-h-[200px] overflow-y-auto space-y-2">
                {mockMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={() => toggleMember(member.id)}
                    />
                    <label
                      htmlFor={`member-${member.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {member.name}
                      <span className="text-xs text-muted-foreground ml-2">
                        ({member.membershipPlan})
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              
              {selectedMembers.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {selectedMembers.length} miembro(s) seleccionado(s)
                </p>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* STICKY FOOTER - Always visible */}
        <DialogFooter className="px-6 py-4 border-t bg-background mt-0 flex-shrink-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar Rutina
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
