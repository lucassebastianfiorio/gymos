'use client';

import { useState } from 'react';
import { UserRole } from '@/contracts';
import { RoleGuard } from '@/components/auth/role-guard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockClassDefinitions, mockSessions } from '@/data/classes';
import { mockStaff } from '@/data/staff';
import { ClassDefinitionList } from './_components/class-definition-list';
import { WeeklySchedule } from './_components/weekly-schedule';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, List } from 'lucide-react';

export default function ClassesPage() {
    const [view, setView] = useState<'schedule' | 'definitions'>('schedule');

    return (
        <RoleGuard allowedRoles={[UserRole.AdminTenant, UserRole.Trainer, UserRole.Staff]}>
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Clases y Agenda</h1>
                </div>

                <Tabs defaultValue="schedule" className="w-full">
                    <TabsList>
                        <TabsTrigger value="schedule">
                            <CalendarIcon className="mr-2 h-4 w-4" /> Agenda Semanal
                        </TabsTrigger>
                        <TabsTrigger value="definitions">
                            <List className="mr-2 h-4 w-4" /> Tipos de Clase
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="schedule" className="mt-4">
                         <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">Esta Semana</h2>
                            <Button>Nueva Sesión</Button>
                        </div>
                        <WeeklySchedule 
                            sessions={mockSessions} 
                            classes={mockClassDefinitions}
                            staff={mockStaff}
                            onSessionClick={(s) => alert(`Click en sesión: ${s.id}`)}
                        />
                    </TabsContent>
                    
                    <TabsContent value="definitions" className="mt-4">
                        <ClassDefinitionList 
                            definitions={mockClassDefinitions} 
                            onEdit={(def) => console.log('Edit', def)}
                            onCreate={() => console.log('Create')}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </RoleGuard>
    );
}
