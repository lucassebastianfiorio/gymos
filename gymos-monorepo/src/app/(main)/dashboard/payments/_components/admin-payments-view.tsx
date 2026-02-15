"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale" // You might need to check if this locale is available or just use default
import { Plus, Filter, Download, AlertTriangle, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { PaymentForm } from "./payment-form"
import { FinanceCharts } from "./finance-charts"
import { mockPayments, getOverduePayments, calculatePaymentTotal } from "@/data/payments"
import { mockMembers } from "@/data/members"
import { mockLocations } from "@/data/locations"
import { Payment } from "@/contracts"
import { toast } from "sonner"
import { useAuthStore } from "@/lib/auth/store"
import { UserRole } from "@/contracts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function AdminPaymentsView() {
  const { user, selectedLocationId } = useAuthStore()
  const [payments, setPayments] = useState<Payment[]>(mockPayments.sort((a, b) => b.date.getTime() - a.date.getTime()))
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState<string | "all">(
    user?.role === UserRole.Staff && selectedLocationId ? selectedLocationId : "all"
  )

  const overduePayments = getOverduePayments()
  const totalRevenue = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0)
  
  const pendingRevenue = payments
    .filter(p => p.status === 'Pending' || p.status === 'Overdue')
    .reduce((sum, p) => sum + p.amount, 0)

  const handleRegisterPayment = (data: any) => {
    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      tenantId: "tenant_1",
      daysLate: 0,
      lateFee: 0,
      interest: 0,
      paidDate: new Date(), // Since it's a registration of payment
      dueDate: new Date(), // Assuming immediate payment or we should ask for due date if it was a past obligation
      ...data,
    }
    
    // Logic for late fee if we were paying an existing debt would be different
    // customized logic here for demo
    
    setPayments([newPayment, ...payments])
    setIsDialogOpen(false)
    toast.success("Pago registrado correctamente")
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.concept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "all" || payment.locationId === locationFilter;
    return matchesSearch && matchesLocation;
  })

  const getLocationName = (id?: string) => {
    if (!id) return "-"
    return mockLocations.find(l => l.id === id)?.name || id
  }

  return (
    <div className="space-y-6">
      {overduePayments.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium">Pagos Vencidos Detectados</h3>
            <p className="text-red-700 text-sm mt-1">
              Hay {overduePayments.length} pagos vencidos que requieren atención.
              Recargo acumulado estimado: {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(overduePayments.reduce((acc, p) => acc + (p.lateFee || 0) + (p.interest || 0), 0))}
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">En el periodo actual</p>
          </CardContent>
        </Card>
        
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendiente de Cobro</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(pendingRevenue)}
            </div>
             <p className="text-xs text-muted-foreground">Incluye vencidos</p>
          </CardContent>
        </Card>
      </div>

      <FinanceCharts payments={payments} tenantId={user?.tenantId || ""} />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {user?.role !== UserRole.Staff && (
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Todas las sucursales" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las sucursales</SelectItem>
                {mockLocations.filter(l => l.tenantId === user?.tenantId).map(loc => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Input 
            placeholder="Buscar por miembro o concepto..." 
            className="w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Registrar Pago
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Pago</DialogTitle>
                <DialogDescription>
                  Ingresa los detalles del pago recibido.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <PaymentForm 
                  onSubmit={handleRegisterPayment} 
                  onCancel={() => setIsDialogOpen(false)} 
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transacciones Recientes</CardTitle>
          <CardDescription>
            Listado de todos los pagos registrados en el sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Miembro</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Sucursal</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{format(payment.date, "dd/MM/yyyy")}</span>
                      <span className="text-xs text-muted-foreground">{format(payment.date, "HH:mm")}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{payment.memberName}</TableCell>
                  <TableCell>{payment.concept}</TableCell>
                  <TableCell>{getLocationName(payment.locationId)}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                   <TableCell>
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: payment.currency }).format(payment.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      payment.status === 'Paid' ? 'default' : 
                      payment.status === 'Overdue' ? 'destructive' : 'secondary'
                    }>
                      {payment.status === 'Paid' ? 'Pagado' : 
                       payment.status === 'Overdue' ? 'Vencido' : 'Pendiente'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
