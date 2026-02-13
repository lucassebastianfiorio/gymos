'use client';

import { Tenant } from '@gymos/contracts';

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

// Simplified columns definition to accept handling edit outside if needed, 
// BUT simply adding the column definition inside a hook or component is cleaner 
// if we want to access props. 
// For now, let's export columns as a function that takes onEdit.

export const getColumns = (onEdit: (tenant: Tenant) => void): ColumnDef<Tenant>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => {
        const plan = row.getValue("plan") as string;
        return <Badge variant={plan === 'Enterprise' ? 'default' : plan === 'Pro' ? 'secondary' : 'outline'}>{plan}</Badge>
    }
  },
  {
    accessorKey: "status",
    header: "Estado",
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
    header: "Usuarios",
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
    const columns = getColumns(onEdit);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
        globalFilter,
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
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}
