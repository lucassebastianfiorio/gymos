'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Users } from 'lucide-react';

const classes = [
  { name: 'Yoga Flow', time: '09:00', instructor: 'Carla', capacity: '15/20', day: 'Mañana' },
  { name: 'HIIT Express', time: '13:00', instructor: 'Marcos', capacity: '10/15', day: 'Mañana' },
  { name: 'Crossfit WOD', time: '18:00', instructor: 'Juan', capacity: '18/20', day: 'Hoy' },
];

export function MemberClasses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <CalendarDays className="h-4 w-4" /> Próximas Clases
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {classes.map((cls, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg border bg-muted/30">
              <div className="flex flex-col">
                <span className="font-bold text-xs">{cls.name}</span>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {cls.day} - {cls.time}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {cls.instructor}
                </Badge>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Users className="h-3 w-3" /> {cls.capacity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
