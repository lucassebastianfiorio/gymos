import { User, UserRole } from '@/contracts';

export const TEST_USERS: User[] = [
    {
        id: 'admin_global_1',
        name: 'Super Admin',
        email: 'admin@gymos.com',
        role: UserRole.AdminGlobal,
        avatarUrl: 'https://i.pravatar.cc/150?u=admin@gymos.com'
    },
    {
        id: 'admin_tenant_1',
        name: 'Admin Gimnasio A',
        email: 'admintenant@gymos.com',
        role: UserRole.AdminTenant,
        tenantId: 'tenant_1',
        avatarUrl: 'https://i.pravatar.cc/150?u=admintenant@gymos.com'
    },
    {
        id: 'trainer_1',
        name: 'Juan Entrenador',
        email: 'trainer@gymos.com',
        role: UserRole.Trainer,
        tenantId: 'tenant_1',
        avatarUrl: 'https://i.pravatar.cc/150?u=trainer@gymos.com'
    },
    {
        id: 'staff_1',
        name: 'Maria Recepción',
        email: 'staff@gymos.com',
        role: UserRole.Staff,
        tenantId: 'tenant_1',
        avatarUrl: 'https://i.pravatar.cc/150?u=staff@gymos.com'
    },
    {
        id: 'coach_1',
        name: 'Pedro Coach',
        email: 'coach@gymos.com',
        role: UserRole.Coach,
        tenantId: 'tenant_1',
        avatarUrl: 'https://i.pravatar.cc/150?u=coach@gymos.com'
    },
    {
        id: 'member_1',
        name: 'Carlos Socio',
        email: 'member@gymos.com',
        role: UserRole.Member,
        tenantId: 'tenant_1',
        avatarUrl: 'https://i.pravatar.cc/150?u=member@gymos.com'
    }
];

export const USERS_BY_EMAIL = TEST_USERS.reduce((acc, user) => {
    acc[user.email] = user;
    return acc;
}, {} as Record<string, User>);
