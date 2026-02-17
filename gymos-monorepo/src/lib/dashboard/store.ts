import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { UserRole } from "@/contracts"

export interface WidgetConfig {
  id: string
  isVisible: boolean
  order: number
  size: "sm" | "md" | "lg"
}

interface DashboardState {
  // Configs indexed by UserRole
  configs: Partial<Record<UserRole, WidgetConfig[]>>
  
  // Actions
  setConfigs: (role: UserRole, widgets: WidgetConfig[]) => void
  toggleVisibility: (role: UserRole, id: string) => void
  setSize: (role: UserRole, id: string, size: WidgetConfig["size"]) => void
  updateOrder: (role: UserRole, activeIds: string[]) => void
  resetToDefault: (role: UserRole, defaultWidgets: { id: string, size: WidgetConfig["size"] }[]) => void
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      configs: {},
      
      setConfigs: (role, widgets) => 
        set((state) => ({
          configs: { ...state.configs, [role]: widgets }
        })),

      toggleVisibility: (role, id) =>
        set((state) => {
          const roleConfig = state.configs[role] || []
          return {
            configs: {
              ...state.configs,
              [role]: roleConfig.map((w) => 
                w.id === id ? { ...w, isVisible: !w.isVisible } : w
              ),
            },
          }
        }),

      setSize: (role, id, size) =>
        set((state) => {
          const roleConfig = state.configs[role] || []
          return {
            configs: {
              ...state.configs,
              [role]: roleConfig.map((w) => 
                w.id === id ? { ...w, size: size } : w
              ),
            },
          }
        }),

      updateOrder: (role, activeIds) =>
        set((state) => {
          const roleConfig = state.configs[role] || []
          // We map the full list, updating order based on position in activeIds
          // Items NOT in activeIds (hidden) keep their relative order at the end or wherever they were
          const updated = [...roleConfig].sort((a, b) => {
            const indexA = activeIds.indexOf(a.id)
            const indexB = activeIds.indexOf(b.id)
            
            if (indexA !== -1 && indexB !== -1) return indexA - indexB
            if (indexA !== -1) return -1
            if (indexB !== -1) return 1
            return 0
          })

          return {
            configs: {
              ...state.configs,
              [role]: updated.map((w, i) => ({ ...w, order: i })),
            },
          }
        }),

      resetToDefault: (role, defaultWidgets) =>
        set((state) => ({
          configs: {
            ...state.configs,
            [role]: defaultWidgets.map((w, i) => ({ 
              id: w.id, 
              isVisible: true, 
              order: i,
              size: w.size 
            })),
          },
        })),
    }),
    {
      name: "gymos-dashboard-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
