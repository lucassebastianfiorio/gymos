'use client';

import { SubscriptionPlan } from '@/contracts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { Edit, Trash } from 'lucide-react';

interface PlansTableProps {
    data: SubscriptionPlan[];
    onEdit: (plan: SubscriptionPlan) => void;
    onDelete: (id: string) => void;
}

export function PlansTable({ data, onEdit, onDelete }: PlansTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Staff Max</TableHead>
                        <TableHead>Socios Max</TableHead>
                        <TableHead>Features</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((plan) => (
                        <TableRow key={plan.id}>
                            <TableCell className="font-medium">
                                <div>{plan.name}</div>
                                <div className="text-xs text-muted-foreground">{plan.description}</div>
                            </TableCell>
                            <TableCell>{plan.currency} {plan.price}</TableCell>
                            <TableCell>{plan.maxStaff}</TableCell>
                            <TableCell>{plan.maxMembers}</TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {plan.features.slice(0, 2).map((f, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                                    ))}
                                    {plan.features.length > 2 && (
                                        <Badge variant="outline" className="text-xs">+{plan.features.length - 2}</Badge>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={plan.status === 'Active' ? 'default' : 'secondary'}>
                                    {plan.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => onEdit(plan)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(plan.id)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
