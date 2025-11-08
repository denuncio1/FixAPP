"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plug, Database, Cloud, Building, Code } from "lucide-react";

const IntegrationsSettingsTab: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plug className="h-5 w-5" /> Integrações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Database className="h-4 w-4" /> ERP e Sistemas Financeiros
          </h3>
          <p className="text-muted-foreground">
            Conecte o FixApp ao seu sistema ERP e financeiro para sincronizar dados de clientes, faturamento e estoque.
          </p>
          <Button variant="link" className="pl-0 mt-2">Gerenciar Integração ERP</Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Cloud className="h-4 w-4" /> IoT e Sensores Industriais
          </h3>
          <p className="text-muted-foreground">
            Receba dados em tempo real de sensores IoT para manutenção preditiva e alertas inteligentes.
          </p>
          <Button variant="link" className="pl-0 mt-2">Configurar Dispositivos IoT</Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Building className="h-4 w-4" /> Plataformas de Gestão Predial
          </h3>
          <p className="text-muted-foreground">
            Integre com sistemas de gestão de edifícios para otimizar a manutenção de infraestruturas.
          </p>
          <Button variant="link" className="pl-0 mt-2">Conectar Gestão Predial</Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Code className="h-4 w-4" /> APIs para Terceiros
          </h3>
          <p className="text-muted-foreground">
            Utilize nossa API para conectar o FixApp a outras ferramentas e serviços personalizados.
          </p>
          <Button variant="link" className="pl-0 mt-2">Documentação da API</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationsSettingsTab;