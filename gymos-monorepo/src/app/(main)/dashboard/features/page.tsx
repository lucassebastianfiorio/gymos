'use client';

import { RoleGuard } from '@/components/auth/role-guard';
import { UserRole } from '@/contracts';
import { mockFeatures } from '@/data/features';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Rocket, Zap } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <RoleGuard allowedRoles={[UserRole.AdminGlobal]}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Features Globales</h1>
            <Button>
                <Rocket className="mr-2 h-4 w-4" /> Desplegar Nueva Feature
            </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockFeatures.map(feature => (
                <Card key={feature.id}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                {feature.name}
                                {feature.status === 'Beta' && <Badge variant="secondary" className="text-xs">Beta</Badge>}
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Key: {feature.key}
                            </CardDescription>
                        </div>
                        <div className="p-2 bg-muted rounded-full">
                            <Zap className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground min-h-[40px]">
                            {feature.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Plan Requerido:</span>
                            <Badge variant="outline">{feature.requiredPlan}</Badge>
                        </div>
                         <div className="flex items-center justify-between text-sm pt-2 border-t">
                            <span className="font-medium">Disponibilidad Global:</span>
                            <Switch checked={feature.isGlobal} onCheckedChange={() => alert(`Toggled ${feature.name} (Mock)`)} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </RoleGuard>
  );
}
