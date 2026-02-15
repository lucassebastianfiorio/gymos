"use client"

import { useState, useMemo, useRef } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale" // You might need to check if this locale is available or just use default
import { Plus, Filter, Download, AlertTriangle, DollarSign, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
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
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { getLatePaymentSettings } from "@/data/late-payment-settings"
import { getUpcomingPayments } from "@/data/payments"

export function AdminPaymentsView() {
  const { user, selectedLocationId } = useAuthStore()
  const [payments, setPayments] = useState<Payment[]>(mockPayments.sort((a, b) => b.date.getTime() - a.date.getTime()))
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | "all">("all")
  const [locationFilter, setLocationFilter] = useState<string | "all">(
    user?.role === UserRole.Staff && selectedLocationId ? selectedLocationId : "all"
  )
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<Payment>[]>(() => [
    {
      accessorKey: "date",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
      cell: ({ row }) => {
        const date = row.original.date
        return (
          <div className="flex flex-col">
            <span>{format(date, "dd/MM/yyyy")}</span>
            <span className="text-xs text-muted-foreground">{format(date, "HH:mm")}</span>
          </div>
        )
      }
    },
    {
      accessorKey: "memberName",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Miembro" />,
      cell: ({ row }) => <span className="font-medium">{row.original.memberName}</span>
    },
    {
      accessorKey: "concept",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Concepto" />,
    },
    {
      accessorKey: "locationId",
      header: "Sucursal",
      cell: ({ row }) => {
        const locId = row.original.locationId
        if (!locId) return "-"
        return mockLocations.find(l => l.id === locId)?.name || locId
      }
    },
    {
      accessorKey: "method",
      header: "Método",
    },
    {
      accessorKey: "amount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
      cell: ({ row }) => {
        const amount = row.original.amount
        const currency = row.original.currency
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount)
      }
    },
    {
      accessorKey: "paidAmount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Pagado" />,
      cell: ({ row }) => {
        const amount = row.original.paidAmount || 0
        const currency = row.original.currency
        return <span className="text-green-600 font-medium">
          {new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount)}
        </span>
      }
    },
    {
      id: "balance",
      header: "Saldo",
      cell: ({ row }) => {
        const balance = row.original.amount - (row.original.paidAmount || 0)
        const currency = row.original.currency
        return <span className={cn(balance > 0 ? "text-red-600 font-bold" : "text-muted-foreground")}>
          {new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(balance)}
        </span>
      }
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge variant={
            status === 'Paid' ? 'default' : 
            status === 'Overdue' ? 'destructive' : 
            status === 'Partial' ? 'outline' : 'secondary'
          }>
            {status === 'Paid' ? 'Pagado' : 
             status === 'Overdue' ? 'Vencido' : 
             status === 'Partial' ? 'Parcial' : 'Pendiente'}
          </Badge>
        )
      }
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const payment = row.original
        const balance = payment.amount - (payment.paidAmount || 0)
        
        if (balance <= 0) return null
        
        return (
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 py-0"
            onClick={() => handlePayBalance(payment)}
          >
            Cobrar Saldo
          </Button>
        )
      }
    }
  ], [])

  const columnFilters = useMemo(() => [
    ...(statusFilter !== "all" ? [{ id: "status", value: statusFilter }] : []),
    ...(locationFilter !== "all" ? [{ id: "locationId", value: locationFilter }] : []),
  ], [statusFilter, locationFilter])

  const tableContainerRef = useRef<HTMLDivElement>(null)

  const scrollToTable = () => {
    tableContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter: searchTerm,
      columnFilters,
    },
    onGlobalFilterChange: setSearchTerm,
  })

  const settings = useMemo(() => getLatePaymentSettings(user?.tenantId || "tenant_1"), [user?.tenantId])
  const overduePayments = useMemo(() => getOverduePayments(), [])
  const upcomingPayments = useMemo(() => getUpcomingPayments(settings?.upcomingPaymentNoticeDays || 7), [settings?.upcomingPaymentNoticeDays])
  const totalRevenue = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0)
  
  const pendingRevenue = payments
    .filter(p => p.status === 'Pending' || p.status === 'Overdue')
    .reduce((sum, p) => sum + p.amount, 0)

  const handlePayBalance = (payment: Payment) => {
    const balance = payment.amount - (payment.paidAmount || 0)
    const amountToPayString = window.prompt(`¿Cuánto desea cobrar? (Saldo pendiente: ${balance})`, balance.toString())
    
    if (amountToPayString === null) return
    
    const amountToPay = parseFloat(amountToPayString)
    if (isNaN(amountToPay) || amountToPay <= 0) {
      toast.error("Monto inválido")
      return
    }

    if (amountToPay > balance) {
      toast.error("El monto no puede superar el saldo pendiente")
      return
    }

    setPayments(prev => prev.map(p => {
      if (p.id === payment.id) {
        const newPaidAmount = (p.paidAmount || 0) + amountToPay
        return {
          ...p,
          paidAmount: newPaidAmount,
          status: newPaidAmount >= p.amount ? "Paid" : "Partial"
        }
      }
      return p
    }))
    
    toast.success(`Se cobraron ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amountToPay)} correctamente`)
  }

  const handleRegisterPayment = (data: any) => {
    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      tenantId: "tenant_1",
      daysLate: 0,
      lateFee: 0,
      interest: 0,
      paidDate: new Date(),
      dueDate: new Date(),
      ...data,
    }
    
    setPayments([newPayment, ...payments])
    setIsDialogOpen(false)
    toast.success("Pago registrado correctamente")
  }

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
            <Button 
              variant="link" 
              className="p-0 h-auto text-red-600 font-bold mt-2"
              onClick={() => {
                setStatusFilter('Overdue')
                scrollToTable()
              }}
            >
              Ver detalle de vencidos →
            </Button>
          </div>
        </div>
      )}

      {upcomingPayments.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md flex items-start">
          <Clock className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
          <div>
            <h3 className="text-amber-800 font-medium">Próximos Vencimientos</h3>
            <p className="text-amber-700 text-sm mt-1">
              Hay {upcomingPayments.length} pagos próximos a vencer en los próximos {settings?.upcomingPaymentNoticeDays || 7} días.
            </p>
            <Button 
              variant="link" 
              className="p-0 h-auto text-amber-600 font-bold mt-2"
              onClick={() => {
                setStatusFilter('Pending')
                scrollToTable()
              }}
            >
              Ver detalles →
            </Button>
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="Paid">Pagados</SelectItem>
              <SelectItem value="Pending">Pendientes</SelectItem>
              <SelectItem value="Overdue">Vencidos</SelectItem>
            </SelectContent>
          </Select>
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

      <Card ref={tableContainerRef}>
        <CardHeader>
          <CardTitle>Transacciones Recientes</CardTitle>
          <CardDescription>
            Listado de todos los pagos registrados en el sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable table={table} columns={columns} />
          <div className="mt-4">
            <DataTablePagination table={table} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
