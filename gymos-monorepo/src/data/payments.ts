import { Payment } from "@/contracts";

export const mockPayments: Payment[] = [
    {
        id: "pay_1",
        memberId: "member_1",
        memberName: "Carlos Socio",
        amount: 50.00,
        currency: "USD",
        status: "Paid",
        method: "Cash",
        date: new Date("2026-02-10"),
        dueDate: new Date("2026-02-10"),
        concept: "Cuota Febrero 2026",
        tenantId: "tenant_1"
    },
    {
        id: "pay_2",
        memberId: "member_2",
        memberName: "Ana Gomez",
        amount: 50.00,
        currency: "USD",
        status: "Pending",
        method: "Transfer",
        date: new Date("2026-02-12"),
        dueDate: new Date("2026-02-15"),
        concept: "Cuota Febrero 2026",
        tenantId: "tenant_1"
    },
    {
        id: "pay_3",
        memberId: "member_3",
        memberName: "Luis Perez",
        amount: 50.00,
        currency: "USD",
        status: "Overdue",
        method: "Card",
        date: new Date("2026-01-10"),
        dueDate: new Date("2026-01-15"),
        concept: "Cuota Enero 2026",
        tenantId: "tenant_1"
    }
];
