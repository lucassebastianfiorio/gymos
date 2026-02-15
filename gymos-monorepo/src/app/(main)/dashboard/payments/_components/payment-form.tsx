"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { mockMembers } from "@/data/members"
import { mockLocations } from "@/data/locations"

const formSchema = z.object({
  memberId: z.string({ required_error: "Seleccione un miembro" }),
  concept: z.string().min(3, "El concepto es requerido"),
  amount: z.coerce.number().min(0.01, "El monto debe ser mayor a 0"),
  locationId: z.string({ required_error: "Seleccione una sucursal" }),
  method: z.enum(["Cash", "Card", "Transfer", "MercadoPago"]),
  date: z.date(),
  notes: z.string().optional(),
})

interface PaymentFormProps {
  onSubmit: (values: any) => void
  onCancel?: () => void
}

export function PaymentForm({ onSubmit, onCancel }: PaymentFormProps) {
  const [openMemberSelect, setOpenMemberSelect] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      date: new Date(),
      method: "Cash",
      notes: "",
      locationId: mockLocations[0]?.id || "", // Default to first location
    },
  })

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const selectedMember = mockMembers.find(m => m.id === values.memberId)
    
    onSubmit({
      ...values,
      memberName: selectedMember ? (selectedMember.name || `${selectedMember.firstName} ${selectedMember.lastName}`) : "Unknown",
      status: "Paid", // If we are registering a payment, it's paid
      currency: "ARS", // Default currency
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        
        <FormField
          control={form.control}
          name="memberId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Miembro</FormLabel>
              <Popover open={openMemberSelect} onOpenChange={setOpenMemberSelect}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? (() => {
                            const m = mockMembers.find((member) => member.id === field.value);
                            return m ? (m.name || `${m.firstName} ${m.lastName}`) : "Seleccionar miembro";
                          })()
                        : "Seleccionar miembro"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar miembro..." />
                    <CommandList>
                      <CommandEmpty>No se encontraron miembros.</CommandEmpty>
                      <CommandGroup>
                        {mockMembers.map((member) => (
                          <CommandItem
                            value={member.name || `${member.firstName} ${member.lastName}`}
                            key={member.id}
                            onSelect={() => {
                              form.setValue("memberId", member.id)
                              if (member.assignedLocationId) {
                                form.setValue("locationId", member.assignedLocationId)
                              }
                              setOpenMemberSelect(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                member.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {member.name || `${member.firstName} ${member.lastName}`} ({member.dni || "Sin DNI"})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto (ARS)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Pago</FormLabel>
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
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FormField
            control={form.control}
            name="concept"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Concepto</FormLabel>
                <FormControl>
                  <Input placeholder="Cuota Mensual - Marzo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de Pago</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione método" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Cash">Efectivo</SelectItem>
                    <SelectItem value="Card">Tarjeta</SelectItem>
                    <SelectItem value="Transfer">Transferencia</SelectItem>
                    <SelectItem value="MercadoPago">MercadoPago</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="locationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sucursal</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione sucursal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockLocations.map(loc => (
                      <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              <FormDescription>
                Sucursal donde se registra el ingreso.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas Adicionales</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Detalles adicionales..." 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
            {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
            )}
            <Button type="submit" size="lg">
                Registrar Pago
            </Button>
        </div>
      </form>
    </Form>
  )
}
