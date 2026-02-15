"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Payment } from "@/contracts"
import { mockLocations } from "@/data/locations"

interface FinanceChartsProps {
  payments: Payment[]
  tenantId: string
}

export function FinanceCharts({ payments, tenantId }: FinanceChartsProps) {
  // 1. Income by Branch (Bar Chart)
  const branchData = mockLocations
    .filter(l => l.tenantId === tenantId)
    .map(loc => {
      const branchPayments = payments.filter(p => p.locationId === loc.id && p.status === 'Paid');
      const total = branchPayments.reduce((sum, p) => sum + p.amount, 0);
      return {
        name: loc.name,
        total: total,
      };
    });

  const branchConfig = {
    total: {
      label: "Ingresos",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // 2. Income over time (Area Chart - mock groups for display)
  // In a real app, we would group by payment.date
  const timeData = [
    { date: "2026-02-10", total: 12000 },
    { date: "2026-02-11", total: 15000 },
    { date: "2026-02-12", total: 8000 },
    { date: "2026-02-13", total: 25000 },
    { date: "2026-02-14", total: 18000 },
    { date: "2026-02-15", total: 22000 },
  ];

  const timeConfig = {
    total: {
      label: "Ingresos Diarios",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Ingresos por Sucursal</CardTitle>
          <CardDescription>Distribución de ingresos en el periodo actual.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={branchConfig} className="h-[300px] w-full">
            <BarChart data={branchData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="total" fill="var(--color-total)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Ingresos</CardTitle>
          <CardDescription>Ingresos generales de los últimos días.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={timeConfig} className="h-[300px] w-full">
            <AreaChart data={timeData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.split('-')[2]} // Show only day
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="natural"
                dataKey="total"
                stroke="var(--color-total)"
                fill="var(--color-total)"
                fillOpacity={0.4}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
