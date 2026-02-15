"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockLocations } from "@/data/locations"
import { Staff, UserRole } from "@/contracts"

const formSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  role: z.enum([UserRole.AdminTenant, UserRole.Trainer, UserRole.Staff, UserRole.Dietitian]),
  specialties: z.array(z.string()).optional(),
  bio: z.string().optional(),
  assignedLocationIds: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Debe asignar al menos una sucursal.",
  }),
})

interface EditStaffDialogProps {
  staff: Staff | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function EditStaffDialog({ staff, open, onOpenChange, onSubmit }: EditStaffDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: UserRole.Trainer,
      specialties: [],
      bio: "",
      assignedLocationIds: [],
    },
    values: staff ? {
      name: staff.name,
      email: staff.email,
      role: staff.role as any,
      specialties: staff.specialties,
      bio: staff.bio,
      assignedLocationIds: staff.assignedLocationIds || [],
    } : undefined
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{staff ? "Editar Personal" : "Agregar Personal"}</DialogTitle>
          <DialogDescription>
            Actualiza los datos y asignaciones del personal.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez" {...field} />
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
                    <Input placeholder="juan@gymos.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione rol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={UserRole.Trainer}>Entrenador</SelectItem>
                          <SelectItem value={UserRole.Staff}>Staff / Recepción</SelectItem>
                          <SelectItem value={UserRole.Dietitian}>Nutricionista</SelectItem>
                          <SelectItem value={UserRole.AdminTenant}>Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <FormField
              control={form.control}
              name="assignedLocationIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Sucursales Asignadas</FormLabel>
                    <FormDescription>
                      Seleccione las sucursales donde este personal tiene acceso.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border rounded-md p-4">
                    {mockLocations.map((location) => (
                      <FormField
                        key={location.id}
                        control={form.control}
                        name="assignedLocationIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={location.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(location.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, location.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== location.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-sm cursor-pointer">
                                {location.name}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biografía / Notas</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Breve descripción..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
