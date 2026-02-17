'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Bell } from 'lucide-react';

export function MemberMessages() {
  const messages = [
    { title: 'Feriado de Carnaval', content: 'El gimnasio permanecerá cerrado el lunes y martes.', date: 'Hoy' },
    { title: 'Nueva Clase de Boxeo', content: 'Sumamos un nuevo horario los jueves a las 19:00hs.', date: 'Ayer' },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <MessageSquare className="h-4 w-4" /> Mensajes del Gimnasio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className="flex gap-3 border-b pb-2 last:border-0 last:pb-0">
            <div className="mt-1 h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Bell className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold">{msg.title}</span>
                <span className="text-[10px] text-muted-foreground">{msg.date}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{msg.content}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
