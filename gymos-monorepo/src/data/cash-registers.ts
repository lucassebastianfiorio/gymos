import { CashRegisterSession, CashMovement } from '@/contracts';

export const mockCashSessions: CashRegisterSession[] = [
    {
        id: 'sess_1',
        tenantId: 'tenant_1',
        locationId: 'loc_1',
        openedBy: 'staff_1',
        openedByName: 'Roberto Gómez',
        openedAt: new Date('2026-02-15T08:00:00'),
        openingBalance: 5000,
        status: 'Open',
    },
    {
        id: 'sess_2',
        tenantId: 'tenant_1',
        locationId: 'loc_2',
        openedBy: 'staff_4',
        openedByName: 'Sofia Martínez',
        openedAt: new Date('2026-02-15T09:00:00'),
        openingBalance: 3000,
        status: 'Open',
    }
];

export const mockCashMovements: CashMovement[] = [
    {
        id: 'mov_1',
        sessionId: 'sess_1',
        tenantId: 'tenant_1',
        locationId: 'loc_1',
        type: 'Income',
        amount: 12000,
        concept: 'Pago Juan Pérez - Cuota Febrero',
        date: new Date('2026-02-15T10:30:00'),
        performedBy: 'staff_1',
        performedByName: 'Roberto Gómez',
        paymentId: 'pay_1'
    },
    {
        id: 'mov_2',
        sessionId: 'sess_1',
        tenantId: 'tenant_1',
        locationId: 'loc_1',
        type: 'Expense',
        amount: 1500,
        concept: 'Limpieza e insumos',
        date: new Date('2026-02-15T11:00:00'),
        performedBy: 'staff_1',
        performedByName: 'Roberto Gómez'
    }
];

export function getActiveSessionByLocation(locationId: string): CashRegisterSession | undefined {
    return mockCashSessions.find(s => s.locationId === locationId && s.status === 'Open');
}

export function getSessionsByLocation(locationId: string): CashRegisterSession[] {
    return mockCashSessions.filter(s => s.locationId === locationId);
}

export function getMovementsBySession(sessionId: string): CashMovement[] {
    return mockCashMovements.filter(m => m.sessionId === sessionId);
}
