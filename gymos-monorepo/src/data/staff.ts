import { Staff, UserRole } from '@/contracts';

export const mockStaff: Staff[] = [
    {
        id: 'staff_1',
        name: 'Roberto Gómez',
        email: 'roberto.gomez@gym.com',
        role: UserRole.AdminTenant,
        tenantId: 'tenant_1',
        specialties: ['Gestión', 'Ventas'],
        bio: 'Gerente general con 10 años de experiencia.',
        assignedLocationIds: [],
        availableAtAllLocations: true, // Admin has access to all locations
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
        assignedLocationIds: ['loc_1', 'loc_2'], // Works at Centro and Palermo
        availableAtAllLocations: false,
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
        assignedLocationIds: ['loc_1'], // Only at Centro
        availableAtAllLocations: false,
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
        assignedLocationIds: ['loc_2'], // Only at Palermo
        availableAtAllLocations: false,
        avatarUrl: 'https://i.pravatar.cc/150?u=sofia'
    }
];

// Helper functions
export function getStaffByLocation(locationId: string): Staff[] {
    return mockStaff.filter(s => 
        s.availableAtAllLocations || s.assignedLocationIds.includes(locationId)
    );
}

export function getStaffByTenant(tenantId: string): Staff[] {
    return mockStaff.filter(s => s.tenantId === tenantId);
}

export function getStaffByRole(role: UserRole): Staff[] {
    return mockStaff.filter(s => s.role === role);
}

export function getTrainers(): Staff[] {
    return mockStaff.filter(s => s.role === UserRole.Trainer);
}

export function assignStaffToLocation(staffId: string, locationId: string): boolean {
    const staff = mockStaff.find(s => s.id === staffId);
    if (!staff || staff.availableAtAllLocations) return false;
    
    if (!staff.assignedLocationIds.includes(locationId)) {
        staff.assignedLocationIds.push(locationId);
    }
    return true;
}

export function unassignStaffFromLocation(staffId: string, locationId: string): boolean {
    const staff = mockStaff.find(s => s.id === staffId);
    if (!staff) return false;
    
    const index = staff.assignedLocationIds.indexOf(locationId);
    if (index > -1) {
        staff.assignedLocationIds.splice(index, 1);
        return true;
    }
    return false;
}

export function setStaffAvailableAtAll(staffId: string, availableAtAll: boolean): boolean {
    const staff = mockStaff.find(s => s.id === staffId);
    if (!staff) return false;
    
    staff.availableAtAllLocations = availableAtAll;
    if (availableAtAll) {
        staff.assignedLocationIds = [];
    }
    return true;
}

