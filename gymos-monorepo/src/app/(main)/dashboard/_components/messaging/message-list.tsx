'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Bell, User, Building, ShieldCheck } from 'lucide-react';
import { Message, UserRole } from '@/contracts';
import { mockMessages } from '@/data/messages';
import { useAuthStore } from '@/lib/auth/store';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface MessageListProps {
  limit?: number;
  showTitle?: boolean;
}

export function MessageList({ limit = 5, showTitle = true }: MessageListProps) {
  const { user } = useAuthStore();

  if (!user) return null;

  // Filtering logic based on user role and context
  const filteredMessages = mockMessages.filter(msg => {
    // 1. Global messages for everyone
    if (msg.targetType === 'All') return true;

    // 2. Tenant messages
    if (msg.targetType === 'Tenant' && msg.targetId === user.tenantId) return true;

    // 3. Role-based messages
    if (msg.targetType === 'Role' && msg.targetId === user.role) {
        // If it's a tenant-specific role message (like "all staff in this gym")
        if (msg.tenantId && msg.tenantId !== user.tenantId) return false;
        return true;
    }

    // 4. Direct messages
    if (msg.targetType === 'User' && msg.targetId === user.id) return true;

    return false;
  }).sort((a, b) => b.date.getTime() - a.date.getTime());

  const displayMessages = filteredMessages.slice(0, limit);

  const getIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.AdminGlobal: return <ShieldCheck className="h-4 w-4 text-purple-600" />;
      case UserRole.AdminTenant: return <Building className="h-4 w-4 text-blue-600" />;
      case UserRole.Staff: return <User className="h-4 w-4 text-green-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getBg = (role: UserRole) => {
    switch (role) {
      case UserRole.AdminGlobal: return "bg-purple-50";
      case UserRole.AdminTenant: return "bg-blue-50";
      case UserRole.Staff: return "bg-green-50";
      default: return "bg-gray-50";
    }
  };

  return (
    <Card className="border-none shadow-none md:shadow-sm md:border">
      {showTitle && (
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="h-4 w-4" /> Comunicaciones
            </CardTitle>
          </CardHeader>
      )}
      <CardContent className={cn("space-y-3", !showTitle && "pt-4")}>
        {displayMessages.length === 0 ? (
            <div className="text-center py-6">
                <p className="text-xs text-muted-foreground">No tienes mensajes nuevos.</p>
            </div>
        ) : (
            displayMessages.map((msg) => (
              <div key={msg.id} className="flex gap-3 border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                <div className={cn("mt-1 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0", getBg(msg.senderRole))}>
                  {getIcon(msg.senderRole)}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold leading-tight">{msg.title}</span>
                        <span className="text-[9px] text-muted-foreground">De: {msg.senderName}</span>
                    </div>
                    <span className="text-[9px] text-muted-foreground text-right whitespace-nowrap">
                        {formatDistanceToNow(msg.date, { addSuffix: true, locale: es })}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{msg.content}</p>
                </div>
              </div>
            ))
        )}
      </CardContent>
    </Card>
  );
}
