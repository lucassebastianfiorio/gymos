import { Member, UserRole } from '@/contracts';

export const mockMembers: Member[] = [
    {
        id: 'mem_1',
        name: 'Juan Pérez',
        email: 'juan.perez@email.com',
        role: UserRole.Member,
        tenantId: 'tenant_1',
        status: 'Active',
        membershipPlan: 'Premium',
        joinDate: new Date('2025-01-15'),
        lastVisit: new Date('2026-02-12'),
        phone: '+54 9 11 1234 5678',
        avatarUrl: 'https://i.pravatar.cc/150?u=juan'
    },
    {
        id: 'mem_2',
        name: 'María García',
        email: 'maria.garcia@email.com',
        role: UserRole.Member,
        tenantId: 'tenant_1',
        status: 'Active',
        membershipPlan: 'Basic',
        joinDate: new Date('2025-03-10'),
        lastVisit: new Date('2026-02-10'),
        phone: '+54 9 11 8765 4321',
        avatarUrl: 'https://i.pravatar.cc/150?u=maria'
    },
    {
        id: 'mem_3',
        name: 'Carlos López',
        email: 'carlos.lopez@email.com',
        role: UserRole.Member,
        tenantId: 'tenant_1',
        status: 'Inactive',
        membershipPlan: 'Basic',
        joinDate: new Date('2024-11-05'),
        lastVisit: new Date('2025-12-20'),
        avatarUrl: 'https://i.pravatar.cc/150?u=carlos'
    },
    {
        id: 'mem_4',
        name: 'Ana Rodríguez',
        email: 'ana.rod@email.com',
        role: UserRole.Member,
        tenantId: 'tenant_1',
        status: 'Pending',
        membershipPlan: 'VIP',
        joinDate: new Date('2026-02-13'),
        avatarUrl: 'https://i.pravatar.cc/150?u=ana'
    }
];
