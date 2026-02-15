"use client"

import { useState } from "react"
import { Plus, Users, MapPin, Clock } from "lucide-react"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ClassForm } from "./_components/class-form"
import { mockScheduledClasses } from "@/data/scheduled-classes"
import { mockLocations } from "@/data/locations"
import { getTrainers } from "@/data/staff"
import { ScheduledClass, UserRole } from "@/contracts"
import { useAuthStore } from "@/lib/auth/store"
import { toast } from "sonner"

export default function SchedulePage() {
  const { user } = useAuthStore()
  const [classes, setClasses] = useState<ScheduledClass[]>(mockScheduledClasses)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const canEdit = user?.role === UserRole.AdminGlobal || 
                  user?.role === UserRole.AdminTenant || 
                  user?.role === UserRole.Staff;

  const handleCreateClass = (data: any) => {
    const newClass: ScheduledClass = {
      id: `class_${Date.now()}`,
      tenantId: "tenant_1",
      ...data,
      currentBookings: 0,
    }
    setClasses([...classes, newClass])
    setIsDialogOpen(false)
    toast.success("Clase programada correctamente")
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta clase?")) {
      setClasses(classes.filter(c => c.id !== id))
      toast.success("Clase eliminada")
    }
  }

  const days = [
    { value: "1", label: "Lunes" },
    { value: "2", label: "Martes" },
    { value: "3", label: "Miércoles" },
    { value: "4", label: "Jueves" },
    { value: "5", label: "Viernes" },
    { value: "6", label: "Sábado" },
    { value: "0", label: "Domingo" },
  ]

  const getTrainerName = (id: string) => {
    const trainer = getTrainers().find(t => t.id === id)
    return trainer ? trainer.name : "Sin asignar"
  }

  const getLocationName = (id: string) => {
    const location = mockLocations.find(l => l.id === id)
    return location ? location.name : "Desconocido"
  }

  const getDayLabel = (dayValue: string) => {
      const d = days.find(x => x.value === dayValue)
      return d ? d.label : dayValue
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cronograma de Clases</h1>
          <p className="text-muted-foreground">Horarios y actividades semanales.</p>
        </div>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Programar Clase
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Programar Nueva Clase</DialogTitle>
                <DialogDescription>
                  Define el horario y detalles de la clase recurrente.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <ClassForm 
                  onSubmit={handleCreateClass} 
                  onCancel={() => setIsDialogOpen(false)} 
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="1" className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-4 h-auto">
          {days.map(day => (
            <TabsTrigger key={day.value} value={day.value} className="text-xs sm:text-sm py-2">
              <span className="sm:hidden">{day.label.slice(0, 3)}</span> 
              <span className="hidden sm:inline">{day.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {days.map(day => {
          const dayClasses = classes.filter(c => c.dayOfWeek === parseInt(day.value)).sort((a, b) => a.startTime.localeCompare(b.startTime))
          
          return (
            <TabsContent key={day.value} value={day.value} className="mt-0">
               {dayClasses.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                      <Clock className="h-12 w-12 mb-4 opacity-20" />
                      <p>No hay clases programadas para el {getDayLabel(day.value)}.</p>
                    </CardContent>
                  </Card>
               ) : (
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                   {dayClasses.map(cls => (
                     <Card key={cls.id} className="overflow-hidden">
                        <div className="h-2 bg-primary w-full" />
                        <CardHeader className="pb-2 pt-4">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{cls.className}</CardTitle>
                             {canEdit && (
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(cls.id)}>
                                <span className="sr-only">Eliminar</span>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11.295L10.8659 13.0031C10.8261 13.8406 10.1343 14.5 9.29606 14.5H5.70394C4.86566 14.5 4.17387 13.8406 4.13406 13.0031L3.70503 4H3.5C3.22386 4 3 3.77614 3 3.5ZM6.5 6.5C6.5 6.22386 6.27614 6 6 6C5.72386 6 5.5 6.22386 5.5 6.5V11C5.5 11.2761 5.72386 11.5 6 11.5C6.27614 11.5 6.5 11.2761 6.5 11V6.5ZM9.5 6.5C9.5 6.22386 9.27614 6 9 6C8.72386 6 8.5 6.22386 8.5 6.5V11C8.5 11.2761 8.72386 11.5 9 11.5C9.27614 11.5 9.5 11.2761 9.5 11V6.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                              </Button>
                             )}
                          </div>
                          <CardDescription className="flex items-center gap-1 font-medium">
                             <Clock className="h-3 w-3" /> {cls.startTime} ({cls.durationMinutes} min)
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3 text-sm">
                             <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span>{getTrainerName(cls.trainerId)}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="truncate">{getLocationName(cls.locationId)}</span>
                             </div>
                             <div className="pt-2 flex justify-between items-center text-xs text-muted-foreground border-t mt-2">
                                <span>Cupo: {cls.currentBookings} / {cls.capacity}</span>
                                <Badge variant={cls.currentBookings >= cls.capacity ? 'destructive' : 'secondary'}>{cls.currentBookings >= cls.capacity ? 'Lleno' : 'Disponible'}</Badge>
                             </div>
                          </div>
                        </CardContent>
                     </Card>
                   ))}
                 </div>
               )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
