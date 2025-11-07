"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Menu, Camera, ArrowLeft } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useNavigate } from "react-router-dom";

const ImageRecognition = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b bg-card px-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Reconhecimento de Imagem</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Identificação de Falhas por Imagem</h2>
            <p className="text-muted-foreground">
              Utilize a inteligência artificial para detectar falhas em equipamentos através de imagens.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Camera className="h-6 w-6" /> Funcionalidade em Desenvolvimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Esta seção permitirá o upload de imagens de equipamentos para que um sistema de IA possa analisar e identificar possíveis falhas ou anomalias, agilizando o diagnóstico e a manutenção.
              </p>
              <p className="text-lg font-semibold mt-6">
                Fique atento para futuras atualizações!
              </p>
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ImageRecognition;