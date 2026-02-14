import { CheckIn } from "@/contracts";

export const mockCheckIns: CheckIn[] = [
    {
        id: "chk_1",
        memberId: "member_1",
        memberName: "Carlos Socio",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        type: "QR",
        status: "Allowed",
        tenantId: "tenant_1"
    },
    {
        id: "chk_2",
        memberId: "member_2",
        memberName: "Ana Gomez",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        type: "DNI",
        status: "Allowed",
        tenantId: "tenant_1"
    },
    {
        id: "chk_3",
        memberId: "member_3",
        memberName: "Luis Perez",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // Yesterday
        type: "QR",
        status: "Denied",
        deniedReason: "Cuota Vencida",
        tenantId: "tenant_1"
    }
];
