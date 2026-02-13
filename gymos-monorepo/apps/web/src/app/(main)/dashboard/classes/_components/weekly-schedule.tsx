'use client';

import { ClassSession, ClassDefinition, Staff } from '@gymos/contracts';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface WeeklyScheduleProps {
    sessions: ClassSession[];
    classes: ClassDefinition[];
    staff: Staff[];
    currentDate?: Date;
    onSessionClick: (session: ClassSession) => void;
}

export function WeeklySchedule({ sessions, classes, staff, currentDate = new Date(), onSessionClick }: WeeklyScheduleProps) {
    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday start
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));

    const hours = Array.from({ length: 14 }).map((_, i) => i + 7); // 7 AM to 8 PM

    const getSessionsForDayAndTime = (day: Date, hour: number) => {
        return sessions.filter(session => {
            const sessionStart = new Date(session.startTime);
            return isSameDay(sessionStart, day) && sessionStart.getHours() === hour;
        });
    };

    const getClassDef = (id: string) => classes.find(c => c.id === id);
    const getStaff = (id: string) => staff.find(s => s.id === id);

    return (
        <div className="border rounded-md overflow-hidden bg-background">
            <div className="grid grid-cols-8 border-b dark:border-border">
                <div className="p-4 border-r dark:border-border bg-muted/40 font-medium text-sm text-center">Hora</div>
                {weekDays.map((day, i) => (
                    <div key={i} className={cn(
                        "p-4 text-center border-r last:border-r-0 dark:border-border min-w-[120px]",
                        isSameDay(day, new Date()) ? "bg-primary/5" : ""
                    )}>
                         <div className="font-medium text-sm capitalize">{format(day, 'EEEE', { locale: es })}</div>
                         <div className="text-2xl font-bold">{format(day, 'd', { locale: es })}</div>
                    </div>
                ))}
            </div>
            <div className="max-h-[600px] overflow-y-auto">
                {hours.map(hour => (
                    <div key={hour} className="grid grid-cols-8 border-b last:border-b-0 dark:border-border min-h-[100px]">
                        <div className="p-2 border-r dark:border-border text-xs text-muted-foreground text-center sticky left-0 bg-background">
                            {hour}:00
                        </div>
                        {weekDays.map((day, i) => {
                             const daySessions = getSessionsForDayAndTime(day, hour);
                             return (
                                <div key={i} className={cn(
                                    "p-1 border-r last:border-r-0 dark:border-border relative",
                                     isSameDay(day, new Date()) ? "bg-primary/5" : ""
                                )}>
                                    {daySessions.map(session => {
                                        const def = getClassDef(session.classId);
                                        const trainer = getStaff(session.trainerId);
                                        if (!def) return null;
                                        
                                        return (
                                            <div 
                                                key={session.id}
                                                onClick={() => onSessionClick(session)}
                                                className="rounded p-2 mb-1 text-xs cursor-pointer hover:opacity-90 transition-opacity border-l-2 shadow-sm"
                                                style={{ 
                                                    backgroundColor: `${def.color}20`, // 20% opacity
                                                    borderLeftColor: def.color 
                                                }}
                                            >
                                                <div className="font-bold truncate">{def.name}</div>
                                                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                                                    <Avatar className="h-4 w-4">
                                                        <AvatarImage src={trainer?.avatarUrl} />
                                                        <AvatarFallback className="text-[8px]">{trainer?.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="truncate">{trainer?.name.split(' ')[0]}</span>
                                                </div>
                                                <div className="mt-1 text-[10px] text-right">
                                                    {format(new Date(session.startTime), 'HH:mm')} - {format(new Date(session.endTime), 'HH:mm')}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                             )
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
