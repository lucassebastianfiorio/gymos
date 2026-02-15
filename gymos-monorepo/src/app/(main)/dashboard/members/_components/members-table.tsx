'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Member } from "@/contracts";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Edit, UserCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"

export const getColumns = (onEdit: (member: Member) => void): ColumnDef<Member>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Miembro" />,
    cell: ({ row }) => (
        <div className="flex items-center gap-3">
            <Avatar>
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
    accessorKey: "membershipPlan",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Plan" />,
    cell: ({ row }) => {
        const plan = row.getValue("membershipPlan") as string;
        return <Badge variant={plan === 'VIP' ? 'default' : plan === 'Premium' ? 'secondary' : 'outline'}>{plan}</Badge>
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
                status === 'Inactive' ? 'text-gray-500' : 'text-orange-500'
            }`}>
               <span className={`h-2 w-2 rounded-full ${
                   status === 'Active' ? 'bg-green-600' :
                   status === 'Inactive' ? 'bg-gray-500' : 'bg-orange-500'
               }`} />
               {status === 'Active' ? 'Activo' : status === 'Inactive' ? 'Inactivo' : 'Pendiente'}
            </div>
        )
    }
  },
  {
    accessorKey: "lastVisit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Última Visita" />,
    cell: ({ row }) => {
        const date = row.original.lastVisit;
        return date ? <span className="text-sm text-muted-foreground">{date.toLocaleDateString()}</span> : '-';
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const member = row.original
 
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
            <DropdownMenuItem onClick={() => alert("Check-in mock")} className="cursor-pointer">
                <UserCheck className="mr-2 h-4 w-4" /> Registrar Visita
            </DropdownMenuItem>
             <DropdownMenuItem onClick={() => onEdit(member)} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" /> Editar Perfil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

interface MembersTableProps {
  data: Member[];
  onEdit: (member: Member) => void;
}

export function MembersTable({ data, onEdit }: MembersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [filters, setFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const columns = getColumns(onEdit);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters: filters,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Buscar miembros..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        {/* Futuro: Filtros por Plan/Estado aquí */}
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
