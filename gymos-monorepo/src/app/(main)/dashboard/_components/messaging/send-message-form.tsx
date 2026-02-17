'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SendHorizontal, Users, Building, ShieldCheck, User as UserIcon } from 'lucide-react';
import { UserRole, User } from '@/contracts';
import { useAuthStore } from '@/lib/auth/store';
import { toast } from 'sonner';
import { mockTenants } from '@/data/tenants';
import { mockMembers } from '@/data/members';
import { mockStaff } from '@/data/staff';

export function SendMessageForm() {
  const { user } = useAuthStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetType, setTargetType] = useState<string>('');
  const [targetId, setTargetId] = useState<string>('');

  if (!user) return null;

  // Memoize users list based on role and context
  const targetUsers = useMemo(() => {
    if (!targetType.includes('User')) return [];

    let users: User[] = [];
    
    if (user.role === UserRole.AdminGlobal) {
        // Global admin can see EVERYONE
        users = [...mockStaff, ...mockMembers];
    } else if (user.role === UserRole.AdminTenant) {
        // Tenant admin sees everyone in their tenant
        users = [...mockStaff.filter(s => s.tenantId === user.tenantId), ...mockMembers.filter(m => m.tenantId === user.tenantId)];
    } else if (user.role === UserRole.Staff) {
        // Staff sees members in their tenant
        users = mockMembers.filter(m => m.tenantId === user.tenantId);
    }

    return users.filter(u => u.id !== user.id); // Don't message self
  }, [targetType, user]);

  const handleSend = () => {
    if (!title || !content || !targetType) {
        toast.error("Por favor completa todos los campos requeridos.");
        return;
    }

    if (targetType.includes('User') && !targetId) {
        toast.error("Por favor selecciona un destinatario.");
        return;
    }

    // Special case for Staff messaging AdminTenant
    let finalTargetId = targetId;
    if (targetType === 'AdminTenant') {
        const tenantAdmin = mockStaff.find(s => s.tenantId === user.tenantId && s.role === UserRole.AdminTenant);
        if (tenantAdmin) {
            finalTargetId = tenantAdmin.id;
        } else {
            toast.error("No se encontró el administrador del gimnasio.");
            return;
        }
    }

    console.log("Sending message...", { 
        title, 
        content, 
        targetType: targetType.includes('User') ? 'User' : targetType, 
        targetId: finalTargetId, 
        sender: user.name 
    });
    
    toast.success("Mensaje enviado con éxito");
    setTitle('');
    setContent('');
    setTargetType('');
    setTargetId('');
  };

  const getAvailableTargets = () => {
    const targets = [];
    
    if (user.role === UserRole.AdminGlobal) {
        targets.push({ id: 'All', label: 'Global (Gimnasios)', icon: <ShieldCheck className="h-4 w-4" /> });
        targets.push({ id: 'Tenant', label: 'Gimnasio Específico', icon: <Building className="h-4 w-4" /> });
        targets.push({ id: 'User', label: 'Cualquier Usuario', icon: <UserIcon className="h-4 w-4" /> });
    }
    
    if (user.role === UserRole.AdminTenant) {
        targets.push({ id: 'Tenant', label: 'Todo el Gimnasio', icon: <Building className="h-4 w-4" /> });
        targets.push({ id: 'Role_Staff', label: 'Todo el Staff', icon: <Users className="h-4 w-4" /> });
        targets.push({ id: 'Role_Member', label: 'Todos los Miembros', icon: <UserIcon className="h-4 w-4" /> });
        targets.push({ id: 'User', label: 'Usuario Específico', icon: <UserIcon className="h-4 w-4" /> });
    }

    if (user.role === UserRole.Staff) {
        targets.push({ id: 'AdminTenant', label: 'Administrador del Gym', icon: <ShieldCheck className="h-4 w-4" /> });
        targets.push({ id: 'User_Member', label: 'Miembro Específico', icon: <UserIcon className="h-4 w-4" /> });
    }

    return targets;
  };

  const availableTargets = getAvailableTargets();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <SendHorizontal className="h-4 w-4" /> Enviar Mensaje / Notificación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-muted-foreground">Destino</label>
                <Select value={targetType} onValueChange={(v) => {
                    setTargetType(v);
                    setTargetId('');
                }}>
                    <SelectTrigger className="h-8 text-[11px]">
                        <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableTargets.map(t => (
                            <SelectItem key={t.id} value={t.id} className="text-[11px]">
                                <div className="flex items-center gap-2">
                                    {t.icon} {t.label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            {targetType === 'Tenant' && user.role === UserRole.AdminGlobal && (
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Gimnasio</label>
                    <Select value={targetId} onValueChange={setTargetId}>
                        <SelectTrigger className="h-8 text-[11px]">
                            <SelectValue placeholder="Elegir Gym" />
                        </SelectTrigger>
                        <SelectContent>
                            {mockTenants.map(t => (
                                <SelectItem key={t.id} value={t.id} className="text-[11px]">{t.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {targetType.includes('User') && (
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Usuario</label>
                    <Select value={targetId} onValueChange={setTargetId}>
                        <SelectTrigger className="h-8 text-[11px]">
                            <SelectValue placeholder="Elegir Usuario" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                            {targetUsers.map(u => (
                                <SelectItem key={u.id} value={u.id} className="text-[11px]">
                                    {u.name} ({u.role})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>

        <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-muted-foreground">Título</label>
            <Input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Ej: Aviso importante" 
                className="h-8 text-[11px]"
            />
        </div>

        <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-muted-foreground">Contenido</label>
            <Textarea 
                value={content} 
                onChange={e => setContent(e.target.value)} 
                placeholder="Escribe el mensaje aquí..." 
                className="min-h-[80px] text-[11px]"
            />
        </div>

        <Button size="sm" className="w-full h-8 text-[11px]" onClick={handleSend}>
            Enviar Mensaje
        </Button>
      </CardContent>
    </Card>
  );
}
