'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ShieldCheck } from 'lucide-react';

export function MemberDocs() {
  const docs = [
    { name: 'Reglamento Interno', icon: FileText },
    { name: 'Apto Físico 2026', icon: ShieldCheck, status: 'Vigente' },
    { name: 'Consentimiento Salud', icon: FileText },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <FileText className="h-4 w-4" /> Documentación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {docs.map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md transition-colors">
              <div className="flex items-center gap-2">
                <doc.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium">{doc.name}</span>
                {doc.status && <span className="text-[10px] bg-green-100 text-green-700 px-1 rounded">{doc.status}</span>}
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
