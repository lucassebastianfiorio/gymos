'use client';

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Tenant } from "@/contracts";

const tenantSchema = z.object({
  name: z.string().min(2, {
    message: "Tenant name must be at least 2 characters.",
  }),
  plan: z.enum(['Enterprise', 'Pro', 'Standard']),
  contactEmail: z.string().email(),
  // Add other fields as needed
})

interface TenantFormProps {
    defaultValues?: Partial<Tenant>;
    onSubmit: (values: z.infer<typeof tenantSchema>) => void;
}

export function TenantForm({ defaultValues, onSubmit }: TenantFormProps) {
    const form = useForm<z.infer<typeof tenantSchema>>({
        resolver: zodResolver(tenantSchema),
        defaultValues: {
            name: defaultValues?.name || "",
            plan: defaultValues?.plan || "Standard",
            contactEmail: defaultValues?.contactEmail || "",
        },
    })

    return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de Sede</FormLabel>
              <FormControl>
                <Input placeholder="Gym X" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email de Contacto</FormLabel>
              <FormControl>
                <Input placeholder="admin@gymx.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un plan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
             </FormItem>
          )}
        />
        <div className="flex justify-end">
            <Button type="submit">{defaultValues ? 'Actualizar Sede' : 'Crear Sede'}</Button>
        </div>
      </form>
    </Form>
  )
}
