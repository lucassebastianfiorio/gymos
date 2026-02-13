'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
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
import { Member } from "@gymos/contracts"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  membershipPlan: z.enum(["Basic", "Premium", "VIP"]),
  status: z.enum(["Active", "Inactive", "Pending"]),
})

interface MemberFormProps {
    defaultValues?: Member;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
}

export function MemberForm({ defaultValues, onSubmit }: MemberFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: defaultValues?.name || "",
            email: defaultValues?.email || "",
            membershipPlan: defaultValues?.membershipPlan || "Basic",
            status: defaultValues?.status || "Active",
        },
    })

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        // En un caso real, aquí iría la lógica de actualización
        console.log(values);
        onSubmit(values);
    }

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                    <Input placeholder="juan.perez@email.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="membershipPlan"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Plan de Membresía</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione un plan" />
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
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccione estado" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Active">Activo</SelectItem>
                        <SelectItem value="Inactive">Inactivo</SelectItem>
                        <SelectItem value="Pending">Pendiente</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            
            <div className="flex justify-end">
                <Button type="submit">{defaultValues ? 'Actualizar Miembro' : 'Registrar Miembro'}</Button>
            </div>
        </form>
        </Form>
    )
}
