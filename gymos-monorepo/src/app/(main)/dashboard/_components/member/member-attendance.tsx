'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Flame, TrendingUp } from 'lucide-react';

interface MemberAttendanceProps {
  stats: {
    monthlyCount: number;
    streak: number;
    lastVisit?: string;
  };
}

export function MemberAttendance({ stats }: MemberAttendanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 className="h-4 w-4 text-green-600" /> Mi Asistencia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-orange-50 border border-orange-100">
            <Flame className="h-6 w-6 text-orange-600 mb-1" />
            <span className="text-2xl font-bold text-orange-700">{stats.streak}</span>
            <span className="text-[10px] text-orange-600 uppercase font-semibold">Racha actual</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-50 border border-blue-100">
            <TrendingUp className="h-6 w-6 text-blue-600 mb-1" />
            <span className="text-2xl font-bold text-blue-700">{stats.monthlyCount}</span>
            <span className="text-[10px] text-blue-600 uppercase font-semibold">Este mes</span>
          </div>
        </div>
        <p className="mt-4 text-[10px] text-center text-muted-foreground italic">
          ¡Mantené la constancia para alcanzar tus objetivos!
        </p>
      </CardContent>
    </Card>
  );
}
