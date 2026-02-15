"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
// Ensure these imports point to creating component if they don't exist, but they likely do
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Member, GymService } from "@/contracts"
import { mockLocations } from "@/data/locations"
import { getGymServices } from "@/data/services"
import { mockStaff, getTrainers } from "@/data/staff"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  firstName: z.string().min(2, { message: "Mínimo 2 caracteres" }),
  lastName: z.string().min(2, { message: "Mínimo 2 caracteres" }),
  dni: z.string().min(7, { message: "DNI inválido" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(8, { message: "Teléfono requerido" }),
  
  membershipPlan: z.enum(["Basic", "Premium", "VIP"]).optional(),
  planType: z.enum(["monthly", "per_class", "quarterly", "annual"]).optional(),
  planExpirationDate: z.date().optional(),
  status: z.enum(["Active", "Inactive", "Pending", "Suspended"]),
  
  assignedLocationId: z.string().optional(),
  assignedTrainerId: z.string().optional(),
  assignedRoutineId: z.string().optional(),
  
  observations: z.string().optional(),
  assignedServiceIds: z.array(z.string()).default([]),
})

interface MemberFormProps {
  defaultValues?: Member
  onSubmit: (values: any) => void
}

export function MemberForm({ defaultValues, onSubmit }: MemberFormProps) {
  // Split name if firstName/lastName not available (backward compatibility)
  const nameParts = defaultValues?.name?.split(' ') || []
  const defaultFirstName = defaultValues?.firstName || nameParts[0] || ""
  const defaultLastName = defaultValues?.lastName || nameParts.slice(1).join(' ') || ""

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: defaultFirstName,
      lastName: defaultLastName,
      dni: defaultValues?.dni || "",
      email: defaultValues?.email || "",
      phone: defaultValues?.phone || "",
      
      membershipPlan: defaultValues?.membershipPlan || "Basic",
      planType: defaultValues?.planType || "monthly",
      planExpirationDate: defaultValues?.planExpirationDate || new Date(new Date().setMonth(new Date().getMonth() + 1)),
      status: defaultValues?.status || "Active",
      
      assignedLocationId: defaultValues?.assignedLocationId || undefined,
      assignedTrainerId: defaultValues?.assignedTrainerId || undefined,
      assignedRoutineId: defaultValues?.assignedRoutineId || undefined,
      
      observations: defaultValues?.observations || "",
      assignedServiceIds: defaultValues?.assignedServiceIds || [],
    },
  })

  const services = getGymServices("tenant_1")

  // Trainers helper
  const trainers = getTrainers()

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Combine names for backward compatibility
    const submissionData = {
      ...values,
      name: `${values.firstName} ${values.lastName}`,
    }
    onSubmit(submissionData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Información Personal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido</FormLabel>
                  <FormControl>
                    <Input placeholder="Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="dni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DNI</FormLabel>
                  <FormControl>
                    <Input placeholder="12345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="juan@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="+54 11..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Membership Details */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">Membresía</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="membershipPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nivel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione nivel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="planType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Plan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">Mensual</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="annual">Anual</SelectItem>
                      <SelectItem value="per_class">Por Clase</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="planExpirationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Vencimiento del Plan</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Seleccione fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Activo</SelectItem>
                      <SelectItem value="Inactive">Inactivo</SelectItem>
                      <SelectItem value="Pending">Pendiente</SelectItem>
                      <SelectItem value="Suspended">Suspendido</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Services Assignments */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">Servicios Adicionales / Standalone</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="assignedServiceIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Servicios</FormLabel>
                    <FormDescription>
                      Seleccione los servicios específicos que el miembro desea contratar.
                    </FormDescription>
                  </div>
                  {services.map((service) => (
                    <FormField
                      key={service.id}
                      control={form.control}
                      name="assignedServiceIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={service.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(service.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, service.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: string) => value !== service.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {service.name} ({new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(service.price || 0)})
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Assignments */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-medium">Asignaciones</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="assignedLocationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sucursal Asignada</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione sucursal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Sin asignar</SelectItem>
                      {mockLocations.map(loc => (
                        <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignedTrainerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entrenador</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Asignar entrenador" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Sin asignar</SelectItem>
                      {trainers.map(trainer => (
                        <SelectItem key={trainer.id} value={trainer.id}>{trainer.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              control={form.control}
              name="assignedRoutineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rutina</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Asignar rutina" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Sin asignar</SelectItem>
                      <SelectItem value="routine_1">Rutina Principiante</SelectItem>
                      <SelectItem value="routine_2">Rutina Intermedia</SelectItem>
                      <SelectItem value="routine_3">Rutina Avanzada</SelectItem>
                      <SelectItem value="routine_4">Pérdida de Peso</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="observations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observaciones / Ficha Médica</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Notas sobre salud, objetivos, lesiones..." 
                    className="resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg">
            {defaultValues ? 'Actualizar Miembro' : 'Registrar Miembro'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
