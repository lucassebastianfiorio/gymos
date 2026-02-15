"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
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
import { Checkbox } from "@/components/ui/checkbox"
import { SubscriptionPlan } from "@/contracts"

const formSchema = z.object({
  name: z.string().min(3, "Nombre requerido"),
  price: z.coerce.number().min(0),
  durationMonths: z.coerce.number().min(1),
  description: z.string().optional(),
  features: z.array(z.string()),
  maxLocations: z.coerce.number().min(1),
})

interface PlanFormProps {
  initialData?: SubscriptionPlan
  onSubmit: (data: any) => void
  onCancel?: () => void
}

export function PlanForm({ initialData, onSubmit, onCancel }: PlanFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price || 0,
      durationMonths: initialData?.durationMonths || 1,
      description: initialData?.description || "",
      features: initialData?.features || [],
      maxLocations: 1, // Default
    },
  })

  // Mock available features
  const availableFeatures = [
    { id: "gym_access", label: "Acceso al Gimnasio" },
    { id: "classes", label: "Clases Grupales" },
    { id: "trainer", label: "Seguimiento con Entrenador" },
    { id: "sauna", label: "Acceso a Sauna/Spa" },
    { id: "all_branches", label: "Acceso Multisede" },
  ]

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Plan</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Plan Trimestral Gold" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
           <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio (ARS)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="durationMonths"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración (Meses)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Detalles del plan..." className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="features"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Características Incluidas</FormLabel>
                <FormDescription>
                  Seleccione los beneficios que incluye este plan.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 gap-2 border rounded-md p-4">
                {availableFeatures.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="features"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-sm cursor-pointer">
                            {item.label}
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

        <div className="flex justify-end gap-2 pt-4">
           {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit">Guardar Plan</Button>
        </div>
      </form>
    </Form>
  )
}
