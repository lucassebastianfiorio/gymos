"use client"

import { useState } from "react"
import { Plus, Check, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { PlanForm } from "./_components/plan-form"
import { mockPlans } from "@/data/plans"
import { SubscriptionPlan, UserRole } from "@/contracts"
import { RoleGuard } from "@/components/auth/role-guard"
import { toast } from "sonner"

export default function PlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockPlans)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingPlan(null)
    setIsDialogOpen(true)
  }

  const handleSubmit = (data: any) => {
    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? { ...p, ...data } : p))
      toast.success("Plan actualizado")
    } else {
      const newPlan: SubscriptionPlan = {
        id: `plan_${Date.now()}`,
        tenantId: "tenant_1",
        isActive: true, // Default active
        ...data,
      }
      setPlans([...plans, newPlan])
      toast.success("Plan creado")
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
      if(confirm("¿Estás seguro de eliminar este plan?")) {
          setPlans(plans.filter(p => p.id !== id));
          toast.success("Plan eliminado");
      }
  }

  return (
    <RoleGuard allowedRoles={[UserRole.AdminTenant, UserRole.AdminGlobal]}>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Planes de Suscripción</h1>
            <p className="text-muted-foreground">Gestiona las membresías y precios del gimnasio.</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" /> Crear Nuevo Plan
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
           <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingPlan ? 'Editar Plan' : 'Crear Nuevo Plan'}</DialogTitle>
              <DialogDescription>
                Define las características y precio de la suscripción.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <PlanForm 
                initialData={editingPlan || undefined}
                onSubmit={handleSubmit} 
                onCancel={() => setIsDialogOpen(false)} 
              />
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map(plan => (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <Badge variant={plan.isActive ? "default" : "secondary"}>
                        {plan.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                </div>
                <CardDescription className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(plan.price)}
                  <span className="text-sm text-muted-foreground font-normal ml-1">
                     / {plan.durationMonths} {plan.durationMonths === 1 ? 'mes' : 'meses'}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="space-y-2">
                    {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            {feature} 
                            {/* Note: In real app, we map feature IDs to labels */}
                        </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(plan)}>
                      <Edit className="mr-2 h-4 w-4" /> Editar
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(plan.id)}>
                      <Trash className="h-4 w-4" />
                  </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </RoleGuard>
  )
}
