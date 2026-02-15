"use client"

import { useState, useEffect } from "react"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { getLatePaymentSettings, updateLatePaymentSettings } from "@/data/late-payment-settings"
import { LatePaymentSettings } from "@/contracts"

const formSchema = z.object({
  gracePeriodDays: z.coerce.number().min(0),
  dailyInterestRate: z.coerce.number().min(0).max(100),
  fixedLateFee: z.coerce.number().min(0),
})

export default function FinanceSettingsPage() {
  const [settings, setSettings] = useState<LatePaymentSettings | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gracePeriodDays: 5,
      dailyInterestRate: 0.1,
      fixedLateFee: 500,
    },
  })

  // Load initial data
  useEffect(() => {
    const data = getLatePaymentSettings("tenant_1")
    if (data) {
      setSettings(data)
      form.reset({
        gracePeriodDays: data.gracePeriodDays,
        dailyInterestRate: data.dailyInterestRate,
        fixedLateFee: data.fixedLateFee,
      })
    }
  }, [form])

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateLatePaymentSettings("tenant_1", values)
    toast.success("Configuración financiera actualizada")
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configuración Financiera</h3>
        <p className="text-sm text-muted-foreground">
          Ajusta los parámetros para el cálculo automático de recargos y vencimientos.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Política de Pagos Tardíos</CardTitle>
          <CardDescription>
            Define cómo se calculan los intereses y multas por mora.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="gracePeriodDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Días de Gracia</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Número de días después del vencimiento antes de aplicar recargos.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dailyInterestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tasa de Interés Diaria (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>
                        Porcentaje de interés que se acumula por cada día de atraso.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fixedLateFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Multa Fija (ARS)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>
                        Monto fijo que se cobra una única vez al vencer el plazo.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Ejemplo de Cálculo</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Para una cuota de <strong>$10,000</strong> vencida hace <strong>10 días</strong>:</p>
          <ul className="list-disc list-inside ml-2">
            <li>Multa Fija: ${form.getValues().fixedLateFee}</li>
            <li>Interés: 10 días * {form.getValues().dailyInterestRate}% = {10 * Number(form.getValues().dailyInterestRate)}% (${10000 * (10 * Number(form.getValues().dailyInterestRate) / 100)})</li>
            <li><strong>Total Recargo: ${(Number(form.getValues().fixedLateFee) + (10000 * (10 * Number(form.getValues().dailyInterestRate) / 100))).toFixed(2)}</strong></li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
