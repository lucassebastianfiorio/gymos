import { Payment } from '@/contracts';
import { calculateLateFee } from './late-payment-settings';

// Calculate days late helper
function getDaysLate(dueDate: Date, paidDate?: Date): number {
    const compareDate = paidDate || new Date();
    if (compareDate <= dueDate) return 0;
    
    const diffTime = compareDate.getTime() - dueDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export const mockPayments: Payment[] = [
    {
        id: 'pay_1',
        memberId: 'mem_1',
        memberName: 'Juan Pérez',
        tenantId: 'tenant_1',
        locationId: 'loc_1', // Sede Centro
        basePlanAmount: 12000,
        lateFee: 0,
        interest: 0,
        paidAmount: 12000,
        amount: 12000,
        currency: 'ARS',
        status: 'Paid',
        method: 'Transfer',
        date: new Date('2026-02-10'),
        dueDate: new Date('2026-02-15'),
        paidDate: new Date('2026-02-10'),
        concept: 'Cuota Febrero 2026',
        daysLate: 0,
        notes: 'Pago anticipado'
    },
    {
        id: 'pay_2',
        memberId: 'mem_2',
        memberName: 'María García',
        tenantId: 'tenant_1',
        locationId: 'loc_2', // Sede Palermo
        basePlanAmount: 8000,
        lateFee: 0,
        interest: 0,
        paidAmount: 0,
        amount: 8000,
        currency: 'ARS',
        status: 'Pending',
        method: 'Cash',
        date: new Date('2026-02-12'),
        dueDate: new Date('2026-02-20'),
        concept: 'Cuota Febrero 2026',
        daysLate: 0
    },
    {
        id: 'pay_3',
        memberId: 'mem_3',
        memberName: 'Carlos López',
        tenantId: 'tenant_1',
        locationId: 'loc_1',
        basePlanAmount: 10000,
        lateFee: 500, // Applied late fee
        interest: 950, // 19 days * 0.5% = 9.5%
        paidAmount: 0,
        amount: 11450,
        currency: 'ARS',
        status: 'Overdue',
        method: 'Card',
        date: new Date('2026-01-10'),
        dueDate: new Date('2026-01-25'),
        concept: 'Cuota Enero 2026',
        daysLate: getDaysLate(new Date('2026-01-25')),
        notes: 'Miembro suspendido por mora'
    },
    {
        id: 'pay_4',
        memberId: 'mem_4',
        memberName: 'Ana Rodríguez',
        tenantId: 'tenant_1',
        locationId: 'loc_1',
        basePlanAmount: 15000,
        lateFee: 0,
        interest: 0,
        paidAmount: 15000,
        amount: 15000,
        currency: 'ARS',
        status: 'Paid',
        method: 'MercadoPago',
        date: new Date('2026-02-13'),
        dueDate: new Date('2026-02-13'),
        paidDate: new Date('2026-02-13'),
        concept: 'Cuota Ingreso + Febrero 2026',
        daysLate: 0,
        notes: 'Incluye cuota de ingreso'
    },
    {
        id: 'pay_5',
        memberId: 'mem_5',
        memberName: 'Pedro Martínez',
        tenantId: 'tenant_1',
        locationId: 'loc_2',
        basePlanAmount: 12000,
        lateFee: 500,
        interest: 1200, // 20 days * 0.5%
        paidAmount: 0,
        amount: 13700,
        currency: 'ARS',
        status: 'Overdue',
        method: 'Transfer',
        date: new Date('2026-01-10'),
        dueDate: new Date('2026-01-20'),
        concept: 'Cuota Enero 2026',
        daysLate: getDaysLate(new Date('2026-01-20')),
        notes: 'Intentos de contacto sin respuesta'
    },
    {
        id: 'pay_6',
        memberId: 'mem_6',
        memberName: 'Laura Fernández',
        tenantId: 'tenant_1',
        locationId: 'loc_1',
        basePlanAmount: 120000, // Plan anual
        lateFee: 0,
        interest: 0,
        paidAmount: 120000,
        amount: 120000,
        currency: 'ARS',
        status: 'Paid',
        method: 'Transfer',
        date: new Date('2026-02-01'),
        dueDate: new Date('2026-02-01'),
        paidDate: new Date('2026-02-01'),
        concept: 'Plan Anual 2026-2027',
        daysLate: 0,
        notes: 'Descuento por pago anual aplicado (10%)'
    },
    {
        id: 'pay_7',
        memberId: 'mem_1',
        memberName: 'Juan Pérez',
        tenantId: 'tenant_1',
        locationId: 'loc_1',
        basePlanAmount: 12000,
        lateFee: 0,
        interest: 0,
        paidAmount: 0,
        amount: 120000,
        currency: 'ARS',
        status: 'Pending',
        method: 'Cash',
        date: new Date('2026-02-14'),
        dueDate: new Date('2026-03-15'),
        concept: 'Cuota Marzo 2026',
        daysLate: 0
    },
];

// Helper functions
export function getPaymentsByLocation(locationId: string): Payment[] {
    return mockPayments.filter(p => p.locationId === locationId);
}

export function getPaymentsByMember(memberId: string): Payment[] {
    return mockPayments.filter(p => p.memberId === memberId);
}

export function getPaymentsByStatus(status: Payment['status']): Payment[] {
    return mockPayments.filter(p => p.status === status);
}

export function getOverduePayments(): Payment[] {
    return mockPayments.filter(p => p.status === 'Overdue');
}

export function getUpcomingPayments(daysThreshold: number = 7): Payment[] {
    const now = new Date();
    const threshold = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);
    
    return mockPayments.filter(p => {
        return p.status === 'Pending' && p.dueDate >= now && p.dueDate <= threshold;
    });
}

export function calculatePaymentTotal(baseAmount: number, dueDate: Date, tenantId: string): Payment['amount'] {
    const daysLate = getDaysLate(dueDate);
    if (daysLate <= 0) return baseAmount;
    
    const { total } = calculateLateFee(baseAmount, daysLate, tenantId);
    return total;
}

// Helper to update payment with late fees
export function updatePaymentLateFees(payment: Payment): Payment {
    if (payment.status !== 'Overdue') return payment;
    
    const daysLate = getDaysLate(payment.dueDate, payment.paidDate);
    const { lateFee, interest, total } = calculateLateFee(payment.basePlanAmount, daysLate, payment.tenantId);
    
    return {
        ...payment,
        daysLate,
        lateFee,
        interest,
        amount: total
    };
}
