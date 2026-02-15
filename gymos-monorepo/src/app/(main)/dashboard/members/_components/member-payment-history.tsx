"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPaymentsByMember } from "@/data/payments"
import { Payment } from "@/contracts"

interface MemberPaymentHistoryProps {
  memberId: string
}

export function MemberPaymentHistory({ memberId }: MemberPaymentHistoryProps) {
  const payments = getPaymentsByMember(memberId).sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime())

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'Paid': return 'bg-green-500 hover:bg-green-600'
      case 'Pending': return 'bg-yellow-500 hover:bg-yellow-600'
      case 'Overdue': return 'bg-red-500 hover:bg-red-600'
      default: return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: Payment['status']) => {
    switch (status) {
      case 'Paid': return 'Pagado'
      case 'Pending': return 'Pendiente'
      case 'Overdue': return 'Vencido'
      default: return status
    }
  }

  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No hay historial de pagos para este miembro.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Pagos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concepto</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha Pago</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.concept}</TableCell>
                <TableCell>
                  {format(payment.dueDate, "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('es-AR', { style: 'currency', currency: payment.currency }).format(payment.amount)}
                  {payment.lateFee > 0 && (
                    <span className="text-xs text-red-500 block">
                      Incluye recargo: {new Intl.NumberFormat('es-AR', { style: 'currency', currency: payment.currency }).format(payment.lateFee + (payment.interest || 0))}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(payment.status)}>
                    {getStatusLabel(payment.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {payment.paidDate ? format(payment.paidDate, "dd/MM/yyyy") : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
