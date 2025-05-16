'use client';

import { getCsrfToken } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignIn() {
  const [csrfToken, setCsrfToken] = useState<string | undefined>();

  useEffect(() => {
    getCsrfToken().then((token) => setCsrfToken(token ?? undefined));
  }, []);

  if (!csrfToken) return <p className="text-center py-6 text-muted-foreground">Cargando...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="post" action="/api/auth/callback/credentials" className="space-y-4">
            <input name="csrfToken" type="hidden" value={csrfToken} />

            <div className="space-y-1">
              <Label htmlFor="username">Usuario</Label>
              <Input id="username" name="username" type="text" required />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            <Button type="submit" className="w-full mt-4">
              Entrar / Registrarse
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
