import { FeatureFlag, TenantFeatureSettings } from '@/contracts';

// System-wide feature catalog
export const systemFeatures: FeatureFlag[] = [
    {
        id: 'feat_members',
        key: 'members',
        name: 'Gestión de Miembros',
        description: 'CRUD completo de miembros, check-ins, y estados',
        category: 'core'
    },
    {
        id: 'feat_payments',
        key: 'payments',
        name: 'Gestión de Pagos',
        description: 'Registro de pagos, control de mora, y reportes financieros',
        category: 'core'
    },
    {
        id: 'feat_routines',
        key: 'routines',
        name: 'Gestión de Rutinas',
        description: 'Crear y asignar rutinas personalizadas a miembros',
        category: 'premium'
    },
    {
        id: 'feat_classes',
        key: 'classes',
        name: 'Gestión de Clases',
        description: 'Programar clases grupales, reservas, y capacidad',
        category: 'premium'
    },
    {
        id: 'feat_branches',
        key: 'branches',
        name: 'Múltiples Sucursales',
        description: 'Administrar múltiples sedes del gimnasio',
        category: 'addon'
    },
    {
        id: 'feat_reports',
        key: 'reports',
        name: 'Reportes Personalizados',
        description: 'Generar reportes avanzados y exportar datos',
        category: 'premium'
    },
    {
        id: 'feat_qr',
        key: 'qr',
        name: 'Check-in por QR',
        description: 'Sistema de check-in mediante códigos QR',
        category: 'addon'
    },
    {
        id: 'feat_portal',
        key: 'portal',
        name: 'Portal de Miembros',
        description: 'Acceso web/app para que los miembros gestionen sus rutinas y pagos',
        category: 'premium'
    },
    {
        id: 'feat_ai',
        key: 'ai_insights',
        name: 'IA - Predicciones & Insights',
        description: 'Análisis avanzado con IA para predecir abandono y optimizar ingresos',
        category: 'addon'
    },
];

// Mock tenant feature settings
export const mockTenantFeatures: TenantFeatureSettings[] = [
    {
        tenantId: 'tenant_1',
        enabledFeatures: ['members', 'payments', 'routines', 'classes', 'branches', 'qr']
    },
    {
        tenantId: 'tenant_2',
        enabledFeatures: ['members', 'payments', 'routines', 'classes']
    },
    {
        tenantId: 'tenant_3',
        enabledFeatures: ['members', 'payments'] // Basic plan
    },
];

// Helper function to check if feature is enabled for tenant
export function isFeatureEnabled(tenantId: string, featureKey: string): boolean {
    const settings = mockTenantFeatures.find(t => t.tenantId === tenantId);
    return settings?.enabledFeatures.includes(featureKey) ?? false;
}

// Helper function to get enabled features for tenant
export function getEnabledFeatures(tenantId: string): FeatureFlag[] {
    const settings = mockTenantFeatures.find(t => t.tenantId === tenantId);
    if (!settings) return [];
    
    return systemFeatures.filter(f => settings.enabledFeatures.includes(f.key));
}

// Helper function to toggle feature
export function toggleFeature(tenantId: string, featureKey: string): void {
    const settings = mockTenantFeatures.find(t => t.tenantId === tenantId);
    if (!settings) {
        mockTenantFeatures.push({
            tenantId,
            enabledFeatures: [featureKey]
        });
        return;
    }
    
    const index = settings.enabledFeatures.indexOf(featureKey);
    if (index > -1) {
        settings.enabledFeatures.splice(index, 1);
    } else {
        settings.enabledFeatures.push(featureKey);
    }
}
