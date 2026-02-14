import { Exercise, Routine, AssignedRoutine } from "@/contracts";

export const mockExercises: Exercise[] = [
    { id: "ex_1", name: "Press de Banca", description: "Barra plana", muscleGroup: "Chest" },
    { id: "ex_2", name: "Sentadilla Libre", description: "Barra tras nuca", muscleGroup: "Legs" },
    { id: "ex_3", name: "Peso Muerto", description: "Convencional", muscleGroup: "Back" },
    { id: "ex_4", name: "Dominadas", description: "Agarre prono", muscleGroup: "Back" },
    { id: "ex_5", name: "Curl de Biceps", description: "Mancuernas", muscleGroup: "Arms" },
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
