"use client";

import { useAuthStore } from "@/lib/auth/store";
import { mockLocations } from "@/data/locations";
import { Staff, UserRole } from "@/contracts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";

export function BranchSelector() {
  const { user, selectedLocationId, setSelectedLocationId } = useAuthStore();

  const isStaffOrTrainer = user?.role === UserRole.Staff || user?.role === UserRole.Trainer;
  if (!isStaffOrTrainer || !user) return null;

  const staff = user as unknown as Staff;
  const assignedLocations = mockLocations.filter(loc => 
    staff?.availableAtAllLocations || staff?.assignedLocationIds?.includes(loc.id)
  );

  if (assignedLocations.length <= 1 && !staff.availableAtAllLocations) return null;

  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-2 mb-2 px-1">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Sucursal de Trabajo
        </span>
      </div>
      <Select 
        value={selectedLocationId || ""} 
        onValueChange={(val) => setSelectedLocationId(val)}
      >
        <SelectTrigger className="h-9">
          <SelectValue placeholder="Seleccionar sucursal" />
        </SelectTrigger>
        <SelectContent>
          {assignedLocations.map((loc) => (
            <SelectItem key={loc.id} value={loc.id}>
              {loc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
