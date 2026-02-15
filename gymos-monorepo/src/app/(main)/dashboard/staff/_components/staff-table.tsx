'use client';

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { useState } from "react"
import { Staff, UserRole } from "@/contracts";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { mockLocations } from "@/data/locations";

export const getColumns = (onEdit: (staff: Staff) => void): ColumnDef<Staff>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
    cell: ({ row }) => (
        <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={row.original.avatarUrl} />
                <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="font-medium">{row.getValue("name")}</span>
                <span className="text-xs text-muted-foreground">{row.original.email}</span>
            </div>
        </div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rol" />,
    cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return <Badge variant={role === UserRole.AdminTenant ? 'default' : 'secondary'}>{role}</Badge>
    }
  },
  {
    accessorKey: "assignedLocationIds",
    header: "Sedes",
    cell: ({ row }) => {
        const ids = row.original.assignedLocationIds || [];
        if (ids.length === 0) return <span className="text-xs text-muted-foreground">Sin asignación</span>;
        const names = ids.map(id => mockLocations.find(l => l.id === id)?.name || id);
        return (
            <div className="flex gap-1 flex-wrap">
                {names.map(name => <Badge key={name} variant="outline" className="text-[10px]">{name}</Badge>)}
            </div>
        );
    }
  },
  {
    accessorKey: "schedule",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Horarios" />,
    cell: ({ row }) => <span className="text-xs">{row.getValue("schedule") || "-"}</span>
  },
  {
    id: "actions",
    cell: ({ row }) => (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(row.original)}>
            <Pencil className="h-4 w-4" />
        </Button>
    )
  }
]

interface StaffTableProps {
  data: Staff[];
  onEdit: (staff: Staff) => void;
}

export function StaffTable({ data, onEdit }: StaffTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const columns = getColumns(onEdit);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <DataTable table={table} columns={columns} />
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
