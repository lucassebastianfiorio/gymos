import { Member, UserRole } from '@/contracts';

export const mockMembers: Member[] = [
    {
        id: 'mem_1',
        name: 'Juan Pérez', // Keeping for backward compatibility
        firstName: 'Juan',
        lastName: 'Pérez',
        dni: '35123456',
        email: 'juan.perez@email.com',
        phone: '+54 9 11 1234 5678',
        role: UserRole.Member,
        tenantId: 'tenant_1',
        status: 'Active',
        membershipPlan: 'Premium',
        planType: 'monthly',
        planExpirationDate: new Date('2026-03-15'),
        joinDate: new Date('2025-01-15'),
        lastVisit: new Date('2026-02-12'),
        assignedTrainerId: 'trainer_1',
        assignedLocationId: 'loc_1', // Sede Centro
        assignedRoutineId: 'routine_1',
        observations: 'Sin restricciones',
        avatarUrl: 'https://i.pravatar.cc/150?u=juan'
    },
    {
        id: 'mem_2',
        name: 'María García',
        firstName: 'María',
        lastName: 'García',
        dni: '38987654',
        email: 'maria.garcia@email.com',
        phone: '+54 9 11 8765 4321',
        role: UserRole.Member,
        tenantId: 'tenant_1',
        status: 'Active',
        membershipPlan: 'Basic',
        planType: 'per_class',
        planExpirationDate: new Date('2026-04-10'),
        joinDate: new Date('2025-03-10'),
        lastVisit: new Date('2026-02-10'),
        assignedTrainerId: 'trainer_2',
        assignedLocationId: 'loc_2', // Sede Palermo
        observations: 'Lesión de rodilla - evitar impacto',
        avatarUrl: 'https://i.pravatar.cc/150?u=maria'
    },
    {
        id: 'mem_3',
        name: 'Carlos López',
        firstName: 'Carlos',
        lastName: 'López',
        dni: '42555123',
        email: 'carlos.lopez@email.com',
        phone: '+54 9 11 5555 6666',
        role: UserRole.Member,
        tenantId: 'tenant_1',
        status: 'Inactive',
        membershipPlan: 'Basic',
        planType: 'monthly',
        planExpirationDate: new Date('2026-01-05'), // Expired
        joinDate: new Date('2024-11-05'),
        lastVisit: new Date('2025-12-20'),
        assignedLocationId: 'loc_1',
        avatarUrl: 'https://i.pravatar.cc/150?u=carlos'
    },
    {
        id: 'mem_4',
        name: 'Ana Rodríguez',
        firstName: 'Ana',
        lastName: 'Rodríguez',
        dni: '40112233',
        email: 'ana.rod@email.com',
        phone: '+54 9 11 2222 3333',
        role: UserRole.Member,
        tenantId: 'tenant_1',
        status: 'Pending',
        membershipPlan: 'VIP',
        planType: 'quarterly',
        planExpirationDate: new Date('2026-05-13'),
        joinDate: new Date('2026-02-13'),
        assignedTrainerId: 'trainer_1',
        assignedLocationId: 'loc_1',
        assignedRoutineId: 'routine_2',
        observations: 'Principiante',
        avatarUrl: 'https://i.pravatar.cc/150?u=ana'
    },
    {
        id: 'mem_5',
        name: 'Pedro Martínez',
        firstName: 'Pedro',
        lastName: 'Martínez',
        dni: '37444555',
        email: 'pedro.martinez@email.com',
        phone: '+54 9 11 7777 8888',
        role: UserRole.Member,
        tenantId: 'tenant_1',
        status: 'Suspended',
        membershipPlan: 'Premium',
        planType: 'monthly',
        planExpirationDate: new Date('2026-01-20'), // Expired - suspended
        joinDate: new Date('2025-06-01'),
        lastVisit: new Date('2026-01-18'),
        assignedLocationId: 'loc_2',
        observations: 'Suspendido por falta de pago',
        avatarUrl: 'https://i.pravatar.cc/150?u=pedro'
    },
    {
        id: 'mem_6',
        name: 'Laura Fernández',
        firstName: 'Laura',
        lastName: 'Fernández',
        dni: '39666777',
        email: 'laura.fernandez@email.com',
        phone: '+54 9 11 9999 1111',
        role: UserRole.Member,
        tenantId: 'tenant_1',
        status: 'Active',
        membershipPlan: 'VIP',
        planType: 'annual',
        planExpirationDate: new Date('2027-02-01'),
        joinDate: new Date('2026-02-01'),
        lastVisit: new Date('2026-02-14'),
        assignedTrainerId: 'trainer_1',
        assignedLocationId: 'loc_1',
        assignedRoutineId: 'routine_3',
        observations: 'Plan anual - objetivo pérdida de peso',
        avatarUrl: 'https://i.pravatar.cc/150?u=laura'
    },
];

// Helper functions
export function getMembersByLocation(locationId: string): Member[] {
    return mockMembers.filter(m => m.assignedLocationId === locationId);
}

export function getMembersByTrainer(trainerId: string): Member[] {
    return mockMembers.filter(m => m.assignedTrainerId === trainerId);
}

export function getMembersByStatus(status: Member['status']): Member[] {
    return mockMembers.filter(m => m.status === status);
}

export function getExpiringMembers(daysThreshold: number = 7): Member[] {
    const now = new Date();
    const threshold = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);
    
    return mockMembers.filter(m => {
        return m.planExpirationDate >= now && m.planExpirationDate <= threshold;
    });
}

export function getExpiredMembers(): Member[] {
    const now = new Date();
    return mockMembers.filter(m => m.planExpirationDate < now && m.status !== 'Suspended');
}
