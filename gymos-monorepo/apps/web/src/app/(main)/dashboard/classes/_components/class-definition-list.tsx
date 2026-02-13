'use client';

import { ClassDefinition } from '@gymos/contracts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Edit, Trash2, Plus } from 'lucide-react';

interface ClassDefinitionListProps {
    definitions: ClassDefinition[];
    onEdit: (def: ClassDefinition) => void;
    onCreate: () => void;
}

export function ClassDefinitionList({ definitions, onEdit, onCreate }: ClassDefinitionListProps) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Tipos de Clase</h3>
                <Button onClick={onCreate} size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Tipo
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {definitions.map(def => (
                    <Card key={def.id} className="overflow-hidden border-l-4" style={{ borderLeftColor: def.color }}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex justify-between items-center">
                                {def.name}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 min-h-[40px]">
                                {def.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {def.defaultDuration} min
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    Cap: {def.capacity}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 pt-2">
                            <Button variant="ghost" size="icon" onClick={() => onEdit(def)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
