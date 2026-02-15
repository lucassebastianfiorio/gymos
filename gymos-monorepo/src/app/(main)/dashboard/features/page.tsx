"use client"

import { useState } from "react"
import { Check, X, Shield, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
    systemFeatures, 
    mockTenantFeatures, 
    isFeatureEnabled, 
    toggleFeature 
} from "@/data/feature-flags"
import { toast } from "sonner"
import { RoleGuard } from "@/components/auth/role-guard"
import { UserRole } from "@/contracts"

export default function FeaturesPage() {
  const [selectedTenantId, setSelectedTenantId] = useState<string>("tenant_1")
  const [features, setFeatures] = useState(mockTenantFeatures) // Trigger re-render
  // In a real app, toggleFeature would mutate data and we'd refetch or update state
  // Here we force update by copying mockTenantFeatures, but since it's a module level variable
  // we need a way to force re-render. 
  // We can just use a counter or similar, or better:
  // We will assume toggleFeature works on the module variable, and we force re-render.
  const [updateCounter, setUpdateCounter] = useState(0)


  const handleToggle = (featureKey: string) => {
    toggleFeature(selectedTenantId, featureKey)
    setUpdateCounter(c => c + 1)
    toast.success("Funcionalidad actualizada")
  }

  const enabledCount = systemFeatures.filter(f => isFeatureEnabled(selectedTenantId, f.key)).length
  const totalCount = systemFeatures.length

  return (
    <RoleGuard allowedRoles={[UserRole.AdminGlobal]}>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Funcionalidades</h1>
            <p className="text-muted-foreground">Activa o desactiva módulos por gimnasio.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Gimnasio:</span>
            <Select value={selectedTenantId} onValueChange={setSelectedTenantId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar Tenant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tenant_1">Gimnasio Central</SelectItem>
                <SelectItem value="tenant_2">FitLife Belgrano</SelectItem>
                <SelectItem value="tenant_3">PowerGym Norte</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Estado Global</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold md:text-3xl">
                        {enabledCount} / {totalCount}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Módulos activos en este tenant
                    </p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            {['core', 'premium', 'addon'].map(category => (
                <Card key={category} className="col-span-1">
                    <CardHeader>
                        <CardTitle className="capitalize flex items-center gap-2">
                            {category === 'core' && <Shield className="h-5 w-5 text-blue-500" />}
                            {category === 'premium' && <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Premium</Badge>}
                            {category === 'addon' && <Badge variant="outline">Add-on</Badge>}
                            {category === 'core' ? 'Módulos Principales' : category === 'premium' ? 'Funcionalidades Premium' : 'Extensiones'}
                        </CardTitle>
                        <CardDescription>
                            {category === 'core' ? 'Funciones esenciales del sistema.' : 
                             category === 'premium' ? 'Características avanzadas para planes superiores.' : 
                             'Integraciones y herramientas adicionales.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {systemFeatures.filter(f => f.category === category).map(feature => {
                            const isEnabled = isFeatureEnabled(selectedTenantId, feature.key)
                            return (
                                <div key={feature.id} className="flex items-start space-x-4 p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                                    <div className="flex-1 space-y-1">
                                        <p className="font-medium leading-none flex items-center gap-2">
                                            {feature.name}
                                            {feature.description && (
                                                <span className="text-xs text-muted-foreground font-normal hidden sm:inline-block">
                                                    — {feature.description}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <Switch 
                                        checked={isEnabled} 
                                        onCheckedChange={() => handleToggle(feature.key)}
                                        disabled={category === 'core'} // Prevent disabling core features if desired
                                    />
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </RoleGuard>
  )
}
