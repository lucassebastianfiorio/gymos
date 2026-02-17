'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { name: 'Sem 1', attendance: 3 },
  { name: 'Sem 2', attendance: 4 },
  { name: 'Sem 3', attendance: 5 },
  { name: 'Sem 4', attendance: 4 },
];

export function MemberProgress() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <TrendingUp className="h-4 w-4 text-blue-600" /> Mi Progreso Semanal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                itemStyle={{ color: '#2563eb' }}
              />
              <Line 
                type="monotone" 
                dataKey="attendance" 
                stroke="#2563eb" 
                strokeWidth={2} 
                dot={{ r: 4, fill: '#2563eb' }} 
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-center text-xs text-muted-foreground">
          Frecuencia de entrenamientos por semana
        </div>
      </CardContent>
    </Card>
  );
}
