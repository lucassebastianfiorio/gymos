import { LatePaymentSettings } from '@/contracts';

export const mockLatePaymentSettings: LatePaymentSettings[] = [
    {
        tenantId: 'tenant_1',
        interestPerDay: 0.5, // 0.5% per day
        lateFee: 500, // $500 fixed late fee
        suspensionAfterDays: 15, // Suspend member after 15 days
        gracePeriodDays: 3, // 3 days grace period before applying fees
    },
    {
        tenantId: 'tenant_2',
        interestPerDay: 1.0, // 1% per day
        lateFee: 300,
        suspensionAfterDays: 10,
        gracePeriodDays: 5,
    },
    {
        tenantId: 'tenant_3',
        interestPerDay: 0.3,
        lateFee: 200,
        suspensionAfterDays: 20,
        gracePeriodDays: 7,
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
            suspensionAfterDays: settings.suspensionAfterDays ?? 30,
            gracePeriodDays: settings.gracePeriodDays ?? 0,
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
