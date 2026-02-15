import { Location } from '@/contracts';

export const mockLocations: Location[] = [
    {
        id: 'loc_1',
        tenantId: 'tenant_1',
        name: 'Sede Centro',
        address: 'Av. Corrientes 1234',
        city: 'Buenos Aires',
        phone: '+54 11 4567-8901',
        email: 'centro@gimnasionorte.com',
        isActive: true,
        createdAt: new Date('2025-01-15')
    },
    {
        id: 'loc_2',
        tenantId: 'tenant_1',
        name: 'Sede Palermo',
        address: 'Av. Santa Fe 3456',
        city: 'Buenos Aires',
        phone: '+54 11 4567-8902',
        email: 'palermo@gimnazionorte.com',
        isActive: true,
        createdAt: new Date('2025-03-10')
    },
    {
        id: 'loc_3',
        tenantId: 'tenant_1',
        name: 'Sede Belgrano',
        address: 'Av. Cabildo 2345',
        city: 'Buenos Aires',
        phone: '+54 11 4567-8903',
        email: 'belgrano@gimnasionorte.com',
        isActive: true,
        createdAt: new Date('2025-06-20')
    },
    {
        id: 'loc_4',
        tenantId: 'tenant_2',
        name: 'FitBody Center - Sede Principal',
        address: 'Calle Principal 123',
        city: 'Rosario',
        phone: '+54 341 555-1234',
        email: 'info@fitbodycenter.com',
        isActive: true,
        createdAt: new Date('2024-11-01')
    },
];

// Helper function to get locations by tenant
export function getLocationsByTenant(tenantId: string): Location[] {
    return mockLocations.filter(loc => loc.tenantId === tenantId && loc.isActive);
}

// Helper function to check if tenant has locations
export function tenantHasLocations(tenantId: string): boolean {
    return getLocationsByTenant(tenantId).length > 0;
}
