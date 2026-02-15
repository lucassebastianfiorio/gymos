"use client"

import { useState } from "react"
import { Plus, MapPin, Building, Edit, Trash2, Phone, Mail } from "lucide-react"
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
import { LocationForm } from "./_components/location-form"
import { mockLocations } from "@/data/locations"
import { Location } from "@/contracts"
import { toast } from "sonner"

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>(mockLocations)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)

  const handleCreate = (data: any) => {
    // In a real app, this would be an API call
    const newLocation: Location = {
      id: `loc_${Date.now()}`,
      tenantId: "tenant_1", // Mock tenant
      ...data,
      createdAt: new Date(),
    }
    setLocations([...locations, newLocation])
    setIsDialogOpen(false)
    toast.success("Sede creada correctamente")
  }

  const handleUpdate = (data: any) => {
    if (!editingLocation) return
    
    const updatedLocations = locations.map((loc) => 
      loc.id === editingLocation.id ? { ...loc, ...data } : loc
    )
    setLocations(updatedLocations)
    setIsDialogOpen(false)
    setEditingLocation(null)
    toast.success("Sede actualizada correctamente")
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta sede?")) {
      setLocations(locations.filter((loc) => loc.id !== id))
      toast.success("Sede eliminada correctamente")
    }
  }

  const openEditDialog = (location: Location) => {
    setEditingLocation(location)
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingLocation(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Sucursales</h2>
          <p className="text-muted-foreground">
            Administra las sedes y ubicaciones de tu gimnasio.
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Sede
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <Card key={location.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  {location.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {location.address}, {location.city}
                </CardDescription>
              </div>
              <Badge variant={location.isActive ? "default" : "secondary"}>
                {location.isActive ? "Activa" : "Inactiva"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground mt-4">
                {location.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{location.phone}</span>
                  </div>
                )}
                {location.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{location.email}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(location)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(location.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingLocation ? "Editar Sede" : "Agregar Nueva Sede"}
            </DialogTitle>
            <DialogDescription>
              {editingLocation 
                ? "Modifica los detalles de la sucursal existente." 
                : "Ingresa los datos para registrar una nueva sucursal."}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <LocationForm 
              initialData={editingLocation} 
              onSubmit={editingLocation ? handleUpdate : handleCreate} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
