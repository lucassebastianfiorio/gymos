'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, ListChecks } from 'lucide-react';

interface RoutineItem {
  name: string;
  sets: number;
  reps: string;
  notes?: string;
}

interface MemberRoutineViewProps {
  routine: {
    name: string;
    description: string;
    items: RoutineItem[];
  };
}

export function MemberRoutineView({ routine }: MemberRoutineViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-blue-600" /> Mi Rutina: {routine.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{routine.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {routine.items.map((item, i) => (
            <div key={i} className="flex flex-col border-l-2 border-blue-500 pl-4 py-1">
              <div className="flex justify-between items-start">
                <span className="font-bold text-sm">{item.name}</span>
                <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                  {item.sets} x {item.reps}
                </span>
              </div>
              {item.notes && (
                <p className="text-xs text-muted-foreground mt-1 italic">
                  Note: {item.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
