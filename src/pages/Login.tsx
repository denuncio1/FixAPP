"use client";

import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MadeWithDyad } from '@/components/made-with-dyad';
import AppLogo from "@/components/AppLogo"; // Importar AppLogo

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* O logo agora é o próprio CardTitle */}
          <CardTitle className="text-2xl font-bold flex items-center justify-center mb-4">
            <AppLogo className="h-12 w-auto" />
          </CardTitle>
          <p className="text-muted-foreground">Faça login ou crie uma conta para continuar.</p>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            providers={[]} // Removendo provedores de terceiros para simplificar
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary-foreground))',
                  },
                },
              },
            }}
            theme="light"
            redirectTo={window.location.origin + '/dashboard'}
          />
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default Login;