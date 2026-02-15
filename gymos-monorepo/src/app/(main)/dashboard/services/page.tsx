"use client"

import { useState } from "react"
import { Plus, Edit, Trash, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { mockServices, getGymServices } from "@/data/services"
import { GymService, UserRole } from "@/contracts"
import { RoleGuard } from "@/components/auth/role-guard"
import { toast } from "sonner"
import { ServiceForm } from "./_components/service-form"

export default function ServicesPage() {
  const [services, setServices] = useState<GymService[]>(getGymServices("tenant_1"))
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<GymService | null>(null)

  const handleEdit = (service: GymService) => {
    setEditingService(service)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingService(null)
    setIsDialogOpen(true)
  }

  const handleSubmit = (data: any) => {
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? { ...s, ...data } : s))
      toast.success("Servicio actualizado")
    } else {
      const newService: GymService = {
        id: `svc_${Date.now()}`,
        tenantId: "tenant_1",
        isActive: true,
        ...data,
      }
      setServices([...services, newService])
      toast.success("Servicio creado")
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este servicio?")) {
      setServices(services.filter(s => s.id !== id))
      toast.success("Servicio eliminado")
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Wellness': return 'bg-blue-100 text-blue-800'
      case 'Nutrition': return 'bg-green-100 text-green-800'
      case 'Training': return 'bg-purple-100 text-purple-800'
      case 'Special': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <RoleGuard allowedRoles={[UserRole.AdminTenant]}>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Servicios del Gimnasio</h1>
            <p className="text-muted-foreground">Listado de servicios adicionales y complementarios.</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Servicio
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingService ? 'Editar Servicio' : 'Nuevo Servicio'}</DialogTitle>
              <DialogDescription>
                Describe el servicio y su costo si corresponde.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <ServiceForm 
                initialData={editingService || undefined}
                onSubmit={handleSubmit} 
                onCancel={() => setIsDialogOpen(false)} 
              />
            </div>
          </DialogContent>
        </Dialog>

        {services.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-medium">No hay servicios registrados</h3>
            <p className="text-sm text-muted-foreground mb-6">Comienza agregando servicios complementarios como Nutricionista o Sauna.</p>
            <Button onClick={handleCreate}>Agregar Primer Servicio</Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map(service => (
              <Card key={service.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    <Badge className={getCategoryColor(service.category)}>
                      {service.category}
                    </Badge>
                  </div>
                  {service.price && (
                    <CardDescription className="text-xl font-bold text-primary">
                      {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(service.price)}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                    <Edit className="mr-2 h-4 w-4" /> Editar
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(service.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  )
}
