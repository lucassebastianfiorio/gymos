import { LatePaymentSettings } from '@/contracts';

export const mockLatePaymentSettings: LatePaymentSettings[] = [
    {
        tenantId: 'tenant_1',
        interestPerDay: 0.5, // 0.5% per day
        lateFee: 500, // $500 fixed late fee
        gracePeriodDays: 3,
        suspensionAfterDays: 10,
        cancellationAfterDays: 15,
        upcomingPaymentNoticeDays: 7,
    },
    {
        tenantId: 'tenant_2',
        interestPerDay: 1.0, // 1% per day
        lateFee: 300,
        gracePeriodDays: 5,
        suspensionAfterDays: 10,
        cancellationAfterDays: 20,
        upcomingPaymentNoticeDays: 5,
    },
    {
        tenantId: 'tenant_3',
        interestPerDay: 0.3,
        lateFee: 200,
        gracePeriodDays: 7,
        suspensionAfterDays: 15,
        cancellationAfterDays: 30,
        upcomingPaymentNoticeDays: 10,
    },
];

// Helper function to get late payment settings for tenant
export function getLatePaymentSettings(tenantId: string): LatePaymentSettings | undefined {
    return mockLatePaymentSettings.find(s => s.tenantId === tenantId);
}

// Helper function to update late payment settings
export function updateLatePaymentSettings(tenantId: string, settings: Partial<LatePaymentSettings>): boolean {
    const index = mockLatePaymentSettings.findIndex(s => s.tenantId === tenantId);
    
    if (index === -1) {
        // Create new settings
        mockLatePaymentSettings.push({
            tenantId,
            interestPerDay: settings.interestPerDay ?? 0,
            lateFee: settings.lateFee ?? 0,
            gracePeriodDays: settings.gracePeriodDays ?? 0,
            suspensionAfterDays: settings.suspensionAfterDays ?? 10,
            cancellationAfterDays: settings.cancellationAfterDays ?? 30,
            upcomingPaymentNoticeDays: settings.upcomingPaymentNoticeDays ?? 7,
        });
        return true;
    }
    
    // Update existing settings
    mockLatePaymentSettings[index] = {
        ...mockLatePaymentSettings[index],
        ...settings,
    };
    return true;
}

// Helper function to calculate late fee for a payment
export function calculateLateFee(
    baseAmount: number,
    daysLate: number,
    tenantId: string
): { lateFee: number; interest: number; total: number } {
    const settings = getLatePaymentSettings(tenantId);
    
    if (!settings || daysLate <= settings.gracePeriodDays) {
        return { lateFee: 0, interest: 0, total: baseAmount };
    }
    
    const effectiveDaysLate = daysLate - settings.gracePeriodDays;
    const interest = baseAmount * (settings.interestPerDay / 100) * effectiveDaysLate;
    const lateFee = settings.lateFee;
    const total = baseAmount + interest + lateFee;
    
    return {
        lateFee,
        interest: Number(interest.toFixed(2)),
        total: Number(total.toFixed(2)),
    };
}
