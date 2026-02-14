import { Exercise, Routine, AssignedRoutine } from "@/contracts";

export const mockExercises: Exercise[] = [
    { id: "ex_1", name: "Press de Banca", description: "Barra plana", muscleGroup: "Chest" },
    { id: "ex_2", name: "Sentadilla Libre", description: "Barra tras nuca", muscleGroup: "Legs" },
    { id: "ex_3", name: "Peso Muerto", description: "Convencional", muscleGroup: "Back" },
    { id: "ex_4", name: "Dominadas", description: "Agarre prono", muscleGroup: "Back" },
    { id: "ex_5", name: "Curl de Biceps", description: "Mancuernas", muscleGroup: "Arms" },
    { id: "ex_6", name: "Press Militar", description: "Barra de pie", muscleGroup: "Shoulders" },
    { id: "ex_7", name: "Fondos en Paralelas", description: "Peso corporal", muscleGroup: "Chest" },
    { id: "ex_8", name: "Remo con Barra", description: "Agarre supino", muscleGroup: "Back" },
    { id: "ex_9", name: "Zancadas", description: "Con mancuernas", muscleGroup: "Legs" },
    { id: "ex_10", name: "Plancha Abdominal", description: "Isométrico", muscleGroup: "Core" },
    { id: "ex_11", name: "Elevaciones Laterales", description: "Mancuernas", muscleGroup: "Shoulders" },
    { id: "ex_12", name: "Press Inclinado", description: "Mancuernas 30°", muscleGroup: "Chest" },
    { id: "ex_13", name: "Extensión de Tríceps", description: "Polea alta", muscleGroup: "Arms" },
    { id: "ex_14", name: "Prensa de Pierna", description: "45 grados", muscleGroup: "Legs" },
    { id: "ex_15", name: "Russian Twist", description: "Con disco", muscleGroup: "Core" },
];

export const mockRoutines: Routine[] = [
    {
        id: "rout_1",
        name: "Full Body A",
        description: "Rutina de cuerpo completo para principiantes.",
        difficulty: "Beginner",
        items: [
            { exerciseId: "ex_2", sets: 3, reps: "10", restSeconds: 60 },
            { exerciseId: "ex_1", sets: 3, reps: "10", restSeconds: 60 },
            { exerciseId: "ex_4", sets: 3, reps: "Max", restSeconds: 90 },
        ],
        tenantId: "tenant_1"
    },
    {
        id: "rout_2",
        name: "Torso Fuerza",
        description: "Enfoque en fuerza de tren superior.",
        difficulty: "Intermediate",
        items: [
            { exerciseId: "ex_1", sets: 5, reps: "5", restSeconds: 120 },
            { exerciseId: "ex_4", sets: 4, reps: "6-8", restSeconds: 90 },
        ],
        tenantId: "tenant_1"
    },
];

export const mockAssignedRoutines: AssignedRoutine[] = [
    {
        id: "assign_1",
        memberId: "member_1", // The mock member
        routineId: "rout_1",
        assignedBy: "trainer_1",
        assignedAt: new Date("2026-01-01"),
        active: true
    }
];

// ========== EJERCICIOS CRUD ==========

export function addExercise(exercise: Omit<Exercise, 'id'>): Exercise {
    const newExercise: Exercise = {
        ...exercise,
        id: `ex_${Date.now()}`,
    };
    mockExercises.push(newExercise);
    return newExercise;
}

export function updateExercise(id: string, updates: Partial<Omit<Exercise, 'id'>>): Exercise | null {
    const index = mockExercises.findIndex(e => e.id === id);
    if (index === -1) return null;
    
    mockExercises[index] = {
        ...mockExercises[index],
        ...updates
    };
    return mockExercises[index];
}

export function deleteExercise(id: string): boolean {
    const index = mockExercises.findIndex(e => e.id === id);
    if (index === -1) return false;
    
    // Check if exercise is used in any routine
    const isUsed = mockRoutines.some(routine => 
        routine.items.some(item => item.exerciseId === id)
    );
    
    if (isUsed) {
        console.warn(`Cannot delete exercise ${id} - it's used in routines`);
        return false;
    }
    
    mockExercises.splice(index, 1);
    return true;
}

// ========== RUTINAS CRUD ==========

export function addRoutine(routine: Omit<Routine, 'id'>): Routine {
    const newRoutine: Routine = {
        ...routine,
        id: `rout_${Date.now()}`,
    };
    mockRoutines.push(newRoutine);
    return newRoutine;
}

export function updateRoutine(id: string, updates: Partial<Omit<Routine, 'id'>>): Routine | null {
    const index = mockRoutines.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    mockRoutines[index] = {
        ...mockRoutines[index],
        ...updates
    };
    return mockRoutines[index];
}

export function deleteRoutine(id: string): boolean {
    const index = mockRoutines.findIndex(r => r.id === id);
    if (index === -1) return false;
    
    // Remove routine
    mockRoutines.splice(index, 1);
    
    // Remove all assignments
    const assignmentIndexes: number[] = [];
    mockAssignedRoutines.forEach((assignment, idx) => {
        if (assignment.routineId === id) {
            assignmentIndexes.push(idx);
        }
    });
    
    // Remove from end to start to avoid index issues
    assignmentIndexes.reverse().forEach(idx => {
        mockAssignedRoutines.splice(idx, 1);
    });
    
    return true;
}

// ========== ASSIGNED ROUTINES CRUD ==========

export function addAssignedRoutine(assignment: Omit<AssignedRoutine, 'id'>): AssignedRoutine {
    const newAssignment: AssignedRoutine = {
        ...assignment,
        id: `assign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    mockAssignedRoutines.push(newAssignment);
    return newAssignment;
}

export function unassignRoutine(assignmentId: string): boolean {
    const index = mockAssignedRoutines.findIndex(a => a.id === assignmentId);
    if (index === -1) return false;
    
    mockAssignedRoutines[index].active = false;
    return true;
}

export function getAssignedRoutinesByMember(memberId: string): AssignedRoutine[] {
    return mockAssignedRoutines.filter(a => a.memberId === memberId && a.active);
}
