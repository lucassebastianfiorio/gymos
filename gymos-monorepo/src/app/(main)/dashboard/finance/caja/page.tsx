"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/lib/auth/store"
import { UserRole, CashRegisterSession, CashMovement } from "@/contracts"
import { mockLocations } from "@/data/locations"
import { 
  getActiveSessionByLocation, 
  getSessionsByLocation, 
  getMovementsBySession,
  mockCashSessions,
  mockCashMovements
} from "@/data/cash-registers"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Plus, 
  Minus, 
  Lock, 
  Unlock, 
  Banknote, 
  ArrowUpRight, 
  ArrowDownLeft,
  DollarSign
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CajaPage() {
  const { user, selectedLocationId } = useAuthStore()
  const [activeSession, setActiveSession] = useState<CashRegisterSession | undefined>()
  const [movements, setMovements] = useState<CashMovement[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>(selectedLocationId || "")
  
  const [isOpeningBox, setIsOpeningBox] = useState(false)
  const [isClosingBox, setIsClosingBox] = useState(false)
  const [isAddingMovement, setIsAddingMovement] = useState(false)
  
  const [openingBalance, setOpeningBalance] = useState("0")
  const [movementType, setMovementType] = useState<"Income" | "Expense" | "Withdrawal">("Income")
  const [movementAmount, setMovementAmount] = useState("")
  const [movementConcept, setMovementConcept] = useState("")

  useEffect(() => {
    if (selectedLocation) {
      const session = getActiveSessionByLocation(selectedLocation)
      setActiveSession(session)
      if (session) {
        setMovements(getMovementsBySession(session.id))
      } else {
        setMovements([])
      }
    }
  }, [selectedLocation])

  const handleOpenBox = () => {
    const newSession: CashRegisterSession = {
      id: `sess_${Date.now()}`,
      tenantId: user?.tenantId || "",
      locationId: selectedLocation,
      openedBy: user?.id || "",
      openedByName: user?.name,
      openedAt: new Date(),
      openingBalance: parseFloat(openingBalance),
      status: 'Open'
    }
    mockCashSessions.push(newSession)
    setActiveSession(newSession)
    setMovements([])
    setIsOpeningBox(false)
    toast.success("Caja abierta correctamente")
  }

  const handleCloseBox = () => {
    if (!activeSession) return
    activeSession.status = 'Closed'
    activeSession.closedAt = new Date()
    activeSession.closedBy = user?.id
    activeSession.closedByName = user?.name
    setActiveSession(undefined)
    setIsClosingBox(false)
    toast.success("Caja cerrada correctamente")
  }

  const handleAddMovement = () => {
    if (!activeSession) return
    const newMovement: CashMovement = {
      id: `mov_${Date.now()}`,
      sessionId: activeSession.id,
      tenantId: user?.tenantId || "",
      locationId: selectedLocation,
      type: movementType as any,
      amount: parseFloat(movementAmount),
      concept: movementConcept,
      date: new Date(),
      performedBy: user?.id || "",
      performedByName: user?.name
    }
    mockCashMovements.push(newMovement)
    setMovements([newMovement, ...movements])
    setMovementAmount("")
    setMovementConcept("")
    setIsAddingMovement(false)
    toast.success("Movimiento registrado")
  }

  const currentBalance = activeSession 
    ? activeSession.openingBalance + movements.reduce((acc, m) => {
        if (m.type === 'Income') return acc + m.amount
        return acc - m.amount
      }, 0)
    : 0

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Caja de Sucursal</h1>
          <p className="text-muted-foreground">Control diario de ingresos, egresos y retiros.</p>
        </div>
        
        {user?.role !== UserRole.Staff && (
          <div className="flex items-center gap-2">
            <Label htmlFor="location-select">Sucursal:</Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Seleccionar sucursal" />
              </SelectTrigger>
              <SelectContent>
                {mockLocations.filter(l => l.tenantId === user?.tenantId).map(loc => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {!activeSession ? (
        <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center">
          <Lock className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle>La caja está cerrada</CardTitle>
          <CardDescription className="mt-2 mb-6">
            Debes abrir la caja para comenzar a registrar movimientos en {mockLocations.find(l => l.id === selectedLocation)?.name || 'esta sucursal'}.
          </CardDescription>
          <Dialog open={isOpeningBox} onOpenChange={setIsOpeningBox}>
            <DialogTrigger asChild>
              <Button size="lg"><Unlock className="mr-2 h-4 w-4" /> Abrir Caja</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Abrir Caja Diaria</DialogTitle>
                <DialogDescription>
                  Ingresa el saldo inicial con el que comienza la jornada.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Saldo Inicial (Efectivo)</Label>
                  <Input 
                    type="number" 
                    value={openingBalance} 
                    onChange={e => setOpeningBalance(e.target.value)} 
                    placeholder="0.00"
                  />
                </div>
                <Button className="w-full" onClick={handleOpenBox}>Iniciar Sesión</Button>
              </div>
            </DialogContent>
          </Dialog>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Saldo Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(currentBalance)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Abierta por {activeSession.openedByName} a las {format(activeSession.openedAt, "HH:mm")}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales (Hoy)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  + {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(movements.filter(m => m.type === 'Income').reduce((s, m) => s + m.amount, 0))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Egresos & Retiros (Hoy)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  - {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(movements.filter(m => m.type !== 'Income').reduce((s, m) => s + m.amount, 0))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-2">
            <Dialog open={isAddingMovement} onOpenChange={setIsAddingMovement}>
              <DialogTrigger asChild>
                <Button onClick={() => setMovementType('Income')} className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" /> Ingreso
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Nuevo Movimiento</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Tipo de Movimiento</Label>
                    <Select value={movementType} onValueChange={(v: any) => setMovementType(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Income">Ingreso</SelectItem>
                        <SelectItem value="Expense">Egreso / Gasto</SelectItem>
                        <SelectItem value="Withdrawal">Retiro de Administración</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Monto</Label>
                    <Input type="number" value={movementAmount} onChange={e => setMovementAmount(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Concepto / Referencia</Label>
                    <Input value={movementConcept} onChange={e => setMovementConcept(e.target.value)} />
                  </div>
                  <Button className="w-full" onClick={handleAddMovement}>Registrar Movimiento</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={() => { setMovementType('Expense'); setIsAddingMovement(true); }}>
              <Minus className="mr-2 h-4 w-4" /> Egreso
            </Button>
            
            {user?.role !== UserRole.Staff && (
              <Button variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-50" onClick={() => { setMovementType('Withdrawal'); setIsAddingMovement(true); }}>
                <Banknote className="mr-2 h-4 w-4" /> Retiro Adm.
              </Button>
            )}

            <div className="flex-1" />
            
            <Dialog open={isClosingBox} onOpenChange={setIsClosingBox}>
              <DialogTrigger asChild>
                <Button variant="destructive"><Lock className="mr-2 h-4 w-4" /> Cerrar Caja</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cerrar Caja Diaria</DialogTitle>
                  <DialogDescription>
                    Saldo final esperado: {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(currentBalance)}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Monto en Efectivo Contado</Label>
                    <Input type="number" placeholder="Ingresa el total contado" />
                  </div>
                  <div className="space-y-2">
                    <Label>Observaciones</Label>
                    <Input placeholder="Diferencias, notas, etc." />
                  </div>
                  <Button variant="destructive" className="w-full" onClick={handleCloseBox}>Confirmar Cierre</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Movimientos de la Sesión</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No hay movimientos registrados</TableCell></TableRow>
                  ) : (
                    movements.map((mov) => (
                      <TableRow key={mov.id}>
                        <TableCell>{format(mov.date, "HH:mm")}</TableCell>
                        <TableCell>
                          <Badge variant={mov.type === 'Income' ? 'default' : mov.type === 'Withdrawal' ? 'secondary' : 'outline'}>
                            {mov.type === 'Income' ? 'Ingreso' : mov.type === 'Withdrawal' ? 'Retiro' : 'Egreso'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{mov.concept}</TableCell>
                        <TableCell>{mov.performedByName}</TableCell>
                        <TableCell className={`text-right font-bold ${mov.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                          {mov.type === 'Income' ? '+' : '-'} {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(mov.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
