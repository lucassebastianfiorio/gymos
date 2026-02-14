import { FeatureDefinition } from '@/contracts';

export const mockFeatures: FeatureDefinition[] = [
    {
        id: 'feat_ai',
        name: 'AI Insights',
        description: 'Advanced analytics powered by AI to predict churn and growth.',
        key: 'ai_insights',
        requiredPlan: 'Enterprise',
        status: 'Beta',
        isGlobal: true,
    },
    {
        id: 'feat_qr',
        name: 'QR Check-in',
        description: 'Contactless check-in system for members.',
        key: 'qr_checkin',
        requiredPlan: 'All',
        status: 'Stable',
        isGlobal: true,
    },
    {
        id: 'feat_reports',
        name: 'Custom Reports',
        description: 'Build your own reports with drag-and-drop metrics.',
        key: 'custom_reports',
        requiredPlan: 'Pro',
        status: 'Stable',
        isGlobal: true,
    },
    {
        id: 'feat_portal',
        name: 'Member Portal',
        description: 'White-label web portal for members to manage subscriptions.',
        key: 'member_portal',
        requiredPlan: 'All',
        status: 'Stable',
        isGlobal: true,
    },
];
