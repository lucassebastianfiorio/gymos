"use client"

import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, X, LayoutDashboard, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface WidgetContainerProps {
  id: string
  title: string
  children: React.ReactNode
  onClose?: () => void
  onSizeChange?: (size: "sm" | "md" | "lg") => void
  currentSize?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
}

export function WidgetContainer({
  id,
  title,
  children,
  onClose,
  onSizeChange,
  currentSize = "sm",
  disabled,
  className,
}: WidgetContainerProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md",
        isDragging && "shadow-2xl ring-2 ring-primary",
        className
      )}
    >
      {/* DRAG HANDLE & TOOLBAR */}
      <div className="absolute right-2 top-2 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {!disabled && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded hover:bg-muted" title="Cambiar tamaño">
                   <Maximize2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSizeChange?.("sm")} className={cn(currentSize === "sm" && "bg-accent")}>
                  Pequeño (1/3)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSizeChange?.("md")} className={cn(currentSize === "md" && "bg-accent")}>
                  Mediano (1/2)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSizeChange?.("lg")} className={cn(currentSize === "lg" && "bg-accent")}>
                  Grande (Fila completa)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing rounded p-1 hover:bg-muted"
              title="Arrastrar para reordenar"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded hover:bg-destructive hover:text-destructive-foreground"
              onClick={onClose}
              title="Cerrar widget"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      <div className="h-full w-full pointer-events-auto">
        {children}
      </div>
    </div>
  )
}
