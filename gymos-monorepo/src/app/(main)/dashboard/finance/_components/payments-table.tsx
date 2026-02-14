'use client';

import { Payment } from '@/contracts';
import { Badge } from '@/components/ui/badge';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { format } from 'date-fns';

interface PaymentsTableProps {
    data: Payment[];
}

export function PaymentsTable({ data }: PaymentsTableProps) {
    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Paid': return 'default'; // dark/black
            case 'Pending': return 'secondary'; // gray
            case 'Overdue': return 'destructive'; // red
            default: return 'outline';
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Socio</TableHead>
                        <TableHead>Concepto</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead>Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((payment) => (
                        <TableRow key={payment.id}>
                            <TableCell className="font-medium">
                                {format(payment.date, 'dd/MM/yyyy')}
                            </TableCell>
                            <TableCell>{payment.memberName}</TableCell>
                            <TableCell>{payment.concept}</TableCell>
                            <TableCell>{payment.currency} {payment.amount.toFixed(2)}</TableCell>
                            <TableCell>{payment.method}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusColor(payment.status) as any}>
                                    {payment.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
