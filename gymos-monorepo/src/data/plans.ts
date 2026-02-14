import { SubscriptionPlan } from "@/contracts";

export const mockPlans: SubscriptionPlan[] = [
    {
        id: "plan_basic",
        name: "Plan Básico",
        description: "Ideal para gimnasios pequeños que recién comienzan.",
        price: 29.99,
        currency: "USD",
        features: ["Gestión de Socios", "Control de Asistencia QR", "Reportes Básicos"],
        maxStaff: 2,
        maxMembers: 100,
        includesClasses: false,
        includesApp: false,
        status: "Active"
    },
    {
        id: "plan_pro",
        name: "Plan Profesional",
        description: "Para gimnasios en crecimiento con clases y staff.",
        price: 59.99,
        currency: "USD",
        features: ["Todo lo de Básico", "Gestión de Clases", "App para Socios", "Pagos Online"],
        maxStaff: 5,
        maxMembers: 500,
        includesClasses: true,
        includesApp: true,
        status: "Active"
    },
    {
        id: "plan_enterprise",
        name: "Plan Enterprise",
        description: "Solución completa para grandes cadenas y centros deportivos.",
        price: 99.99,
        currency: "USD",
        features: ["Todo lo de Pro", "Múltiples Sedes", "API Access", "Soporte Dedicado", "IA Insights"],
        maxStaff: 999,
        maxMembers: 9999,
        includesClasses: true,
        includesApp: true,
        status: "Active"
    }
];
