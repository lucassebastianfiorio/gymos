import { Staff, UserRole } from '@gymos/contracts';

export const mockStaff: Staff[] = [
    {
        id: 'staff_1',
        name: 'Roberto Gómez',
        email: 'roberto.gomez@gym.com',
        role: UserRole.AdminTenant,
        tenantId: 'tenant_1',
        specialties: ['Gestión', 'Ventas'],
        bio: 'Gerente general con 10 años de experiencia.',
        avatarUrl: 'https://i.pravatar.cc/150?u=roberto'
    },
    {
        id: 'staff_2',
        name: 'Lucía Fernández',
        email: 'lucia.fer@gym.com',
        role: UserRole.Trainer,
        tenantId: 'tenant_1',
        specialties: ['CrossFit', 'Funcional'],
        schedule: 'Lun-Vie 08:00 - 16:00',
        avatarUrl: 'https://i.pravatar.cc/150?u=lucia'
    },
    {
        id: 'staff_3',
        name: 'Miguel Torres',
        email: 'miguel.torres@gym.com',
        role: UserRole.Coach,
        tenantId: 'tenant_1',
        specialties: ['Musculación', 'Nutrición'],
        schedule: 'Lun-Vie 16:00 - 22:00',
        avatarUrl: 'https://i.pravatar.cc/150?u=miguel'
    },
    {
        id: 'staff_4',
        name: 'Sofia Martínez',
        email: 'sofia.mar@gym.com',
        role: UserRole.Staff,
        tenantId: 'tenant_1',
        specialties: ['Recepción', 'Atención al Cliente'],
        schedule: 'Lun-Sab 09:00 - 15:00',
        avatarUrl: 'https://i.pravatar.cc/150?u=sofia'
    }
];
