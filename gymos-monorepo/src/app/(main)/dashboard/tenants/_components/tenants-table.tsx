'use client';

import { Tenant } from '@/contracts';

interface TenantsTableProps {
    data: Tenant[];
    onEdit: (tenant: Tenant) => void;
}

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import Link from 'next/link';
import { Eye, MoreHorizontal, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { getSortedRowModel, SortingState } from "@tanstack/react-table"

// Simplified columns definition to accept handling edit outside if needed, 
// BUT simply adding the column definition inside a hook or component is cleaner 
// if we want to access props. 
// For now, let's export columns as a function that takes onEdit.

export const getColumns = (onEdit: (tenant: Tenant) => void): ColumnDef<Tenant>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "plan",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Plan" />,
    cell: ({ row }) => {
        const plan = row.getValue("plan") as string;
        return <Badge variant={plan === 'Enterprise' ? 'default' : plan === 'Pro' ? 'secondary' : 'outline'}>{plan}</Badge>
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
            <div className={`flex items-center gap-2 ${
                status === 'Active' ? 'text-green-600' :
                status === 'Inactive' ? 'text-gray-500' : 'text-red-500'
            }`}>
               <span className={`h-2 w-2 rounded-full ${
                   status === 'Active' ? 'bg-green-600' :
                   status === 'Inactive' ? 'bg-gray-500' : 'bg-red-500'
               }`} />
               {status === 'Active' ? 'Activo' : status === 'Inactive' ? 'Inactivo' : 'Suspendido'}
            </div>
        )
    }
  },
  {
    accessorKey: "userCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Usuarios" />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const tenant = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem asChild>
                <Link href={`/dashboard/tenants/${tenant.id}`} className="flex items-center cursor-pointer">
                    <Eye className="mr-2 h-4 w-4" /> Ver Detalles
                </Link>
            </DropdownMenuItem>
             <DropdownMenuItem onClick={() => onEdit(tenant)} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" /> Editar Sede
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function TenantsTable({ data, onEdit }: TenantsTableProps) {
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState<SortingState>([])
    const columns = getColumns(onEdit);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
        globalFilter,
        sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar sedes..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <DataTable table={table} columns={columns} />
      </div>
      <div className="py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}
