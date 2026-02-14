import { ClassDefinition, ClassSession } from '@/contracts';

export const mockClassDefinitions: ClassDefinition[] = [
    {
        id: 'class_def_1',
        name: 'CrossFit WOD',
        description: 'Entrenamiento funcional de alta intensidad del día.',
        defaultDuration: 60,
        capacity: 20,
        color: '#f87171', // Red 400
        tenantId: 'tenant_1'
    },
    {
        id: 'class_def_2',
        name: 'Yoga Flow',
        description: 'Sesión de Vinyasa Yoga para flexibilidad y relajación.',
        defaultDuration: 75,
        capacity: 15,
        color: '#60a5fa', // Blue 400
        tenantId: 'tenant_1'
    },
    {
        id: 'class_def_3',
        name: 'Spinning',
        description: 'Cardio intenso en bicicleta estática.',
        defaultDuration: 45,
        capacity: 25,
        color: '#fbbf24', // Amber 400
        tenantId: 'tenant_1'
    },
    {
        id: 'class_def_4',
        name: 'Pilates Reformer',
        description: 'Ejercicios de bajo impacto en máquinas reformer.',
        defaultDuration: 50,
        capacity: 8,
        color: '#a78bfa', // Violet 400
        tenantId: 'tenant_1'
    }
];

// Helper to generate sessions for the current week
const generateWeeklySessions = (): ClassSession[] => {
    const today = new Date();
    const sessions: ClassSession[] = [];
    
    // Create some sessions for the next 7 days
    for (let i = 0; i < 7; i++) {
        const day = new Date(today);
        day.setDate(today.getDate() + i);
        day.setHours(10, 0, 0, 0); // 10 AM base
        
        // Add a morning class
        sessions.push({
            id: `session_${i}_am`,
            classId: 'class_def_1', // CrossFit
            trainerId: 'staff_2', // Lucia (Trainer)
            startTime: new Date(day),
            endTime: new Date(day.getTime() + 60 * 60 * 1000),
            currentBookings: Math.floor(Math.random() * 20),
            tenantId: 'tenant_1'
        });

        // Add an evening class
        const evening = new Date(day);
        evening.setHours(18, 0, 0, 0); // 6 PM
        sessions.push({
            id: `session_${i}_pm`,
            classId: 'class_def_2', // Yoga
            trainerId: 'staff_2', 
            startTime: new Date(evening),
            endTime: new Date(evening.getTime() + 75 * 60 * 1000),
            currentBookings: Math.floor(Math.random() * 15),
            tenantId: 'tenant_1'
        });
    }
    return sessions;
};

export const mockSessions = generateWeeklySessions();
