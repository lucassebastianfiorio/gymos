import { ScheduledClass } from '@/contracts';

export const mockScheduledClasses: ScheduledClass[] = [
    {
        id: 'sclass_1',
        tenantId: 'tenant_1',
        locationId: 'loc_1', // Sede Centro
        name: 'Yoga Matinal',
        trainerId: 'trainer_1',
        trainerName: 'Carlos Trainer',
        dayOfWeek: 1, // Monday
        startTime: '08:00',
        duration: 60,
        capacity: 20,
        recurrence: 'weekly',
        isActive: true,
        color: '#10b981'
    },
    {
        id: 'sclass_2',
        tenantId: 'tenant_1',
        locationId: 'loc_1',
        name: 'CrossFit',
        trainerId: 'trainer_1',
        trainerName: 'Carlos Trainer',
        dayOfWeek: 1, // Monday
        startTime: '18:00',
        duration: 90,
        capacity: 15,
        recurrence: 'weekly',
        isActive: true,
        color: '#f59e0b'
    },
    {
        id: 'sclass_3',
        tenantId: 'tenant_1',
        locationId: 'loc_2', // Sede Palermo
        name: 'Spinning',
        trainerId: 'trainer_2',
        trainerName: 'Ana Martinez',
        dayOfWeek: 2, // Tuesday
        startTime: '19:00',
        duration: 45,
        capacity: 25,
        recurrence: 'weekly',
        isActive: true,
        color: '#ef4444'
    },
    {
        id: 'sclass_4',
        tenantId: 'tenant_1',
        locationId: 'loc_1',
        name: 'Pilates',
        trainerId: 'trainer_2',
        trainerName: 'Ana Martinez',
        dayOfWeek: 3, // Wednesday
        startTime: '10:00',
        duration: 60,
        capacity: 15,
        recurrence: 'weekly',
        isActive: true,
        color: '#8b5cf6'
    },
    {
        id: 'sclass_5',
        tenantId: 'tenant_1',
        locationId: 'loc_2',
        name: 'Funcional',
        trainerId: 'trainer_1',
        trainerName: 'Carlos Trainer',
        dayOfWeek: 4, // Thursday
        startTime: '17:00',
        duration: 60,
        capacity: 20,
        recurrence: 'weekly',
        isActive: true,
        color: '#06b6d4'
    },
    {
        id: 'sclass_6',
        tenantId: 'tenant_1',
        locationId: 'loc_1',
        name: 'Zumba',
        trainerId: 'trainer_3',
        trainerName: 'Maria Lopez',
        dayOfWeek: 5, // Friday
        startTime: '19:30',
        duration: 60,
        capacity: 30,
        recurrence: 'weekly',
        isActive: true,
        color: '#ec4899'
    },
];

// Helper function to get classes by location
export function getClassesByLocation(locationId: string): ScheduledClass[] {
    return mockScheduledClasses.filter(c => c.locationId === locationId && c.isActive);
}

// Helper function to get classes by trainer
export function getClassesByTrainer(trainerId: string): ScheduledClass[] {
    return mockScheduledClasses.filter(c => c.trainerId === trainerId && c.isActive);
}

// Helper function to get classes by day
export function getClassesByDay(dayOfWeek: number): ScheduledClass[] {
    return mockScheduledClasses.filter(c => c.dayOfWeek === dayOfWeek && c.isActive);
}

// Helper function to add new class
export function addScheduledClass(classData: Omit<ScheduledClass, 'id'>): ScheduledClass {
    const newClass: ScheduledClass = {
        ...classData,
        id: `sclass_${mockScheduledClasses.length + 1}`,
    };
    mockScheduledClasses.push(newClass);
    return newClass;
}

// Helper function to update class
export function updateScheduledClass(classId: string, updates: Partial<ScheduledClass>): boolean {
    const index = mockScheduledClasses.findIndex(c => c.id === classId);
    if (index === -1) return false;
    
    mockScheduledClasses[index] = { ...mockScheduledClasses[index], ...updates };
    return true;
}

// Helper function to deactivate class
export function deactivateScheduledClass(classId: string): boolean {
    return updateScheduledClass(classId, { isActive: false });
}
