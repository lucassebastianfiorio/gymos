import { GymService } from "@/contracts";

export const mockServices: GymService[] = [
    {
        id: "svc_1",
        tenantId: "tenant_1",
        name: "Nutricionista",
        description: "Asesoramiento nutricional personalizado por profesionales.",
        price: 5000,
        category: "Nutrition",
        isActive: true
    },
    {
        id: "svc_2",
        tenantId: "tenant_1",
        name: "Sauna & Spa",
        description: "Acceso ilimitado a la zona de relax y sauna.",
        price: 3000,
        category: "Wellness",
        isActive: true
    },
    {
        id: "svc_3",
        tenantId: "tenant_1",
        name: "Entrenamiento Funcional Especial",
        description: "Clases personalizadas de entrenamiento funcional.",
        price: 8000,
        category: "Training",
        isActive: true
    }
];

export function getGymServices(tenantId: string): GymService[] {
    return mockServices.filter(s => s.tenantId === tenantId);
}
