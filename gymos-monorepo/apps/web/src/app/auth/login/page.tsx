'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { APP_CONFIG } from '@/config/app-config';

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore(state => state.login);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const success = login(email, password);

        if (success) {
            router.push('/dashboard/default');
        } else {
            setError('Credenciales inválidas. Intente nuevamente.');
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full shadow-xl">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold">{APP_CONFIG.name}</CardTitle>
                <CardDescription>
                    Ingrese sus credenciales para acceder
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                                id="email" 
                                name="email" 
                                type="email" 
                                placeholder="admin@gymos.com" 
                                className="pl-9"
                                required 
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Contraseña</Label>
                            <span className="text-xs text-muted-foreground">Dev: 123456</span>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                                id="password" 
                                name="password" 
                                type="password" 
                                className="pl-9"
                                required 
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground text-right">
                             Tip: admin@, admintenant@, trainer@
                        </p>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Ingresando...' : 'Iniciar Sesión'}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
                <div>Versión 2.2.0 (Mock Mode)</div>
            </CardFooter>
        </Card>
    );
}
