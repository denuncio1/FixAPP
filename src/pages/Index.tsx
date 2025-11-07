"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/components/SessionContextProvider";
import AppLogo from "@/components/AppLogo";
import { cn } from "@/lib/utils"; // Importar cn para utilitários de classe

const Index = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) {
      if (session) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    }
  }, [session, isLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-foreground">
      {/* Header com logo à esquerda e à direita */}
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <AppLogo className="h-12 w-auto" /> {/* Logo à esquerda */}
        <AppLogo className="h-12 w-auto" /> {/* Logo à direita */}
      </header>

      {/* Conteúdo principal (mensagem de carregamento) */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <AppLogo className="mx-auto mb-8" /> {/* Logo centralizado para a mensagem de carregamento */}
          <h1 className="text-4xl font-bold mb-4">Carregando...</h1>
          <p className="text-xl text-gray-600">
            Verificando sessão de usuário.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;