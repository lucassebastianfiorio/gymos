'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, Timer, Settings2, Bell, Volume2, VolumeX, AlarmClock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const ALARM_SOUNDS = [
  { id: 'none', name: 'Sin alarma', url: '' },
  { id: 'beep', name: 'Beep Digital', url: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' },
  { id: 'bell', name: 'Campana', url: 'https://assets.mixkit.co/active_storage/sfx/1070/1070-preview.mp3' },
  { id: 'alert', name: 'Alerta Bio', url: 'https://assets.mixkit.co/active_storage/sfx/941/941-preview.mp3' },
];

export function MemberTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'stopwatch' | 'countdown'>('stopwatch');
  const [showSettings, setShowSettings] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(2);
  const [inputSeconds, setInputSeconds] = useState(0);
  const [selectedSoundId, setSelectedSoundId] = useState(ALARM_SOUNDS[1].id); // Default to Beep
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSound = ALARM_SOUNDS.find(s => s.id === selectedSoundId) || ALARM_SOUNDS[1];
  const targetSeconds = inputMinutes * 60 + inputSeconds;

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (mode === 'countdown') {
            if (prev <= 1) {
              setIsActive(false);
              playAlarm();
              return 0;
            }
            return prev - 1;
          } else {
            const next = prev + 1;
            if (targetSeconds > 0 && next === targetSeconds) {
                // In stopwatch, we keep running but play the alarm
                playAlarm();
            }
            return next;
          }
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, mode, targetSeconds, selectedSoundId]);

  const playAlarm = () => {
    if (selectedSoundId === 'none' || !currentSound.url) {
        toast.info("¡Tiempo cumplido!", {
            icon: <Bell className="h-4 w-4 text-blue-600" />,
        });
        return;
    }

    if (audioRef.current) {
      audioRef.current.src = currentSound.url;
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
      toast.info(`¡Tiempo cumplido! (${formatTime(targetSeconds)})`, {
        icon: <Bell className="h-4 w-4 text-blue-600" />,
        action: {
          label: "Detener",
          onClick: () => audioRef.current?.pause()
        }
      });
    }
  };

  const toggle = () => {
    if (!isActive && mode === 'countdown' && seconds === 0) {
        setSeconds(targetSeconds);
    }
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setSeconds(mode === 'countdown' ? targetSeconds : 0);
    if (audioRef.current) audioRef.current.pause();
  };

  const handleModeChange = (newMode: 'stopwatch' | 'countdown') => {
    setIsActive(false);
    setMode(newMode);
    setSeconds(newMode === 'countdown' ? targetSeconds : 0);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(Math.abs(totalSeconds) / 60);
    const secs = Math.abs(totalSeconds) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="relative overflow-hidden">
      <audio ref={audioRef} />
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Timer className="h-4 w-4" /> {mode === 'stopwatch' ? 'Cronómetro' : 'Cuenta atrás'}
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowSettings(!showSettings)}>
            <Settings2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center">
        {showSettings ? (
            <div className="w-full space-y-4 py-2 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Modo</label>
                    <div className="flex gap-2">
                        <Button 
                            variant={mode === 'stopwatch' ? 'default' : 'outline'} 
                            size="sm" 
                            className="flex-1 text-[10px]"
                            onClick={() => handleModeChange('stopwatch')}
                        >
                            Cronómetro
                        </Button>
                        <Button 
                            variant={mode === 'countdown' ? 'default' : 'outline'} 
                            size="sm" 
                            className="flex-1 text-[10px]"
                            onClick={() => handleModeChange('countdown')}
                        >
                            Cuenta atrás
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                            <AlarmClock className="h-3 w-3" /> Minutos
                        </label>
                        <Input 
                            type="number" 
                            min="0"
                            value={inputMinutes} 
                            onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                setInputMinutes(val);
                                if (!isActive && mode === 'countdown') setSeconds(val * 60 + inputSeconds);
                            }}
                            className="h-8"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase text-muted-foreground">Segundos</label>
                        <Input 
                            type="number" 
                            min="0"
                            max="59"
                            value={inputSeconds} 
                            onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                const capped = Math.min(59, Math.max(0, val));
                                setInputSeconds(capped);
                                if (!isActive && mode === 'countdown') setSeconds(inputMinutes * 60 + capped);
                            }}
                            className="h-8"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                        {selectedSoundId !== 'none' ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />} 
                        Sonido de Alarma
                    </label>
                    <Select value={selectedSoundId} onValueChange={setSelectedSoundId}>
                        <SelectTrigger className="h-8 text-[11px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {ALARM_SOUNDS.map(s => (
                                <SelectItem key={s.id} value={s.id} className="text-[11px]">{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <Button size="sm" className="w-full h-8 text-[10px]" onClick={() => setShowSettings(false)}>
                    Listo
                </Button>
            </div>
        ) : (
            <>
                <div className={`text-4xl font-mono font-bold ${mode === 'countdown' && seconds < 10 && isActive ? 'text-red-500 animate-pulse' : ''}`}>
                {formatTime(seconds)}
                </div>
                
                <div className="flex flex-col items-center gap-0.5 mt-1 mb-4 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1.5 ">
                        <AlarmClock className="h-3 w-3" />
                        <span>Objetivo / Alarma: <strong>{formatTime(targetSeconds)}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-80">
                        {selectedSoundId === 'none' ? (
                            <VolumeX className="h-3 w-3" />
                        ) : (
                            <Volume2 className="h-3 w-3" />
                        )}
                        <span>Sonido: {currentSound.name}</span>
                    </div>
                </div>

                <div className="flex gap-2 w-full">
                <Button 
                    size="sm" 
                    className="flex-1"
                    variant={isActive ? "outline" : "default"} 
                    onClick={toggle}
                >
                    {isActive ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                    {isActive ? 'Pausa' : 'Iniciar'}
                </Button>
                <Button size="sm" variant="ghost" onClick={reset}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                </Button>
                </div>
            </>
        )}
      </CardContent>
    </Card>
  );
}
