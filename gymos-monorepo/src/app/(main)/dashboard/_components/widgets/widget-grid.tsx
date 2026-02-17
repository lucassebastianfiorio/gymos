"use client"

import React, { useState, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable"
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers"
import { WidgetContainer } from "./widget-container"
import { getWidgetsForRole, WIDGET_REGISTRY } from "./widget-registry"
import { useDashboardStore } from "@/lib/dashboard/store"
import { UserRole } from "@/contracts"
import { Button } from "@/components/ui/button"
import { Plus, LayoutTemplate } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { mockMembers } from "@/data/members"
import { useAuthStore } from "@/lib/auth/store"
import { cn } from "@/lib/utils"

interface WidgetGridProps {
  role: UserRole
}

export function WidgetGrid({ role }: WidgetGridProps) {
  const { user } = useAuthStore()
  const { configs, setConfigs, updateOrder, toggleVisibility, setSize, resetToDefault } = useDashboardStore()
  const [isClient, setIsClient] = useState(false)

  // Hydration fix
  useEffect(() => {
    setIsClient(true)
    if (!configs[role]) {
      const defaultWidgets = getWidgetsForRole(role).map(w => ({ 
        id: w.id, 
        size: w.defaultSize || "sm" 
      }))
      resetToDefault(role, defaultWidgets)
    }
  }, [role, configs, resetToDefault])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const roleConfigs = configs[role] || []
  const visibleWidgets = roleConfigs
    .filter((c) => c.isVisible)
    .sort((a, b) => a.order - b.order)
  
  const hiddenWidgets = roleConfigs.filter((c) => !c.isVisible)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = visibleWidgets.findIndex((i) => i.id === active.id)
      const newIndex = visibleWidgets.findIndex((i) => i.id === over.id)
      
      const newVisible = arrayMove(visibleWidgets, oldIndex, newIndex)
      updateOrder(role, newVisible.map(v => v.id))
    }
  }

  if (!isClient) return null

  // Special data for widgets
  const currentMember = mockMembers.find(m => m.email === user?.email) || mockMembers[0];
  const mockRoutine = {
      name: "Fuerza e Hipertrofia",
      description: "Enfoque en pecho y tríceps (Día 1)",
      items: [
        { name: "Press de Banca", sets: 4, reps: "8-10", notes: "Controlar el descenso" },
        { name: "Aperturas con Mancuernas", sets: 3, reps: "12", notes: "Máximo estiramiento" },
        { name: "Press Francés", sets: 4, reps: "10", notes: "Codos cerrados" },
        { name: "Extensiones en Polea", sets: 3, reps: "15", notes: "Sostener 1s abajo" },
      ]
    };
  const attendanceStats = { monthlyCount: 12, streak: 5, lastVisit: "Ayer" };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Mi Tablero</h2>
        <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Añadir Widget
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Widgets Disponibles</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {hiddenWidgets.length > 0 ? (
                    hiddenWidgets.map(w => {
                        const def = WIDGET_REGISTRY.find(d => d.id === w.id)
                        return (
                            <DropdownMenuItem key={w.id} onClick={() => toggleVisibility(role, w.id)}>
                                {def?.name}
                            </DropdownMenuItem>
                        )
                    })
                ) : (
                    <p className="text-xs text-muted-foreground p-2 text-center">Todos activos</p>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="sm" onClick={() => resetToDefault(role, getWidgetsForRole(role).map(w => ({ id: w.id, size: w.defaultSize || "sm" })))}>
                <LayoutTemplate className="mr-2 h-4 w-4" /> Resetear
            </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToFirstScrollableAncestor]}
      >
        <div className="grid gap-6 lg:grid-cols-12 auto-rows-min">
          <SortableContext items={visibleWidgets.map((w) => w.id)} strategy={rectSortingStrategy}>
            {visibleWidgets.map((config) => {
              const widgetDef = WIDGET_REGISTRY.find((w) => w.id === config.id)
              if (!widgetDef) return null

              return (
                <WidgetContainer
                  key={config.id}
                  id={config.id}
                  title={widgetDef.name}
                  onClose={() => toggleVisibility(role, config.id)}
                  onSizeChange={(size) => setSize(role, config.id, size)}
                  currentSize={config.size}
                  className={cn(
                    config.size === "sm" && "lg:col-span-4",
                    config.size === "md" && "lg:col-span-6",
                    config.size === "lg" && "lg:col-span-12",
                    "col-span-12" // Default for mobile and < 1024px
                  )}
                >
                  <widgetDef.component 
                    member={currentMember} 
                    routine={mockRoutine} 
                    stats={attendanceStats}
                    limit={3}
                  />
                </WidgetContainer>
              )
            })}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  )
}
