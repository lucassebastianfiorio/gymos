"use client";
import * as React from "react";

import { Banknote, CalendarDays, Dumbbell, LayoutDashboard, Search, Settings, Users } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const searchItems = [
  { group: "Panel", icon: LayoutDashboard, label: "Panel Principal", url: "/dashboard/default" },
  { group: "Gestión", icon: Users, label: "Miembros", url: "/dashboard/members" },
  { group: "Gestión", icon: Banknote, label: "Pagos & Finanzas", url: "/dashboard/payments" },
  { group: "Gestión", icon: Dumbbell, label: "Rutinas", url: "/dashboard/routines/manage" },
  { group: "Gestión", icon: CalendarDays, label: "Clases", url: "/dashboard/schedule" },
  { group: "Configuración", icon: Settings, label: "Ajustes", url: "/dashboard/settings" },
];

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <>
      <Button
        variant="link"
        className="!px-0 font-normal text-muted-foreground hover:no-underline"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        Buscar
        <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium text-[10px]">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar módulos, usuarios y más..." />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          {[...new Set(searchItems.map((item) => item.group))].map((group, i) => (
            <React.Fragment key={group}>
              {i !== 0 && <CommandSeparator />}
              <CommandGroup heading={group} key={group}>
                {searchItems
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <CommandItem 
                        className="!py-1.5 cursor-pointer" 
                        key={item.label} 
                        onSelect={() => handleSelect(item.url)}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
