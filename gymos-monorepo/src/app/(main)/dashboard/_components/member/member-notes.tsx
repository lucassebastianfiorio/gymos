'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote, Save } from 'lucide-react';
import { toast } from 'sonner';

export function MemberNotes() {
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (!note.trim()) return;
    toast.success('Nota guardada');
    // In a real app, this would be saved to a database
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <StickyNote className="h-4 w-4" /> Notas de Entrenamiento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea 
          placeholder="Pesos, sensaciones, recordatorios..." 
          className="min-h-[100px] text-sm resize-none mb-2"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button size="sm" className="w-full" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" /> Guardar Nota
        </Button>
      </CardContent>
    </Card>
  );
}
