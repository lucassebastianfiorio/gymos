'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, MemberStatus } from '@/contracts';
import { Badge } from '@/components/ui/badge';
import { Building, Calendar, IdCard, Mail, Phone } from 'lucide-react';

interface MemberProfileProps {
  member: any; // Using any for simplicity with mock data, but should be Member
}

export function MemberProfile({ member }: MemberProfileProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IdCard className="h-5 w-5" /> Perfil del Miembro
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold">
              {member.name?.[0]}
            </div>
            <div>
              <p className="font-bold">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.email}</p>
            </div>
          </div>
          <Badge className={getStatusColor(member.status || 'Active')}>
            {member.status || 'Activo'}
          </Badge>
        </div>

        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span>Plan: <strong>{member.membershipPlan}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Vence: <strong>{member.planExpirationDate ? new Date(member.planExpirationDate).toLocaleDateString() : 'N/A'}</strong></span>
          </div>
          {member.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{member.phone}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
