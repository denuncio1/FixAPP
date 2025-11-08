"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Menu, Link as LinkIcon, Settings2, Plus, Database, TrendingDown, Scale } from "lucide-react"; // Adicionado Database, TrendingDown, Scale
import Sidebar from "@/components/Sidebar";

const SupplierIntegration = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
          <h1 className="text-xl font-semibold">Integração com Fornecedores</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Conecte-se aos Seus Fornecedores</h2>
            <p className="text-muted-foreground">
              Gerencie a integração com seus fornecedores para automatizar pedidos e atualizações de estoque.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <LinkIcon className="h-6 w-6" /> Integração de Cadeia de Suprimentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Esta seção permite a configuração de integrações diretas com sistemas de fornecedores e ERPs, como **SAP** e **Totvs Proteus**, para otimizar a gestão de estoque e reduzir custos.
              </p>
              <ul className="list-disc list-inside text-left text-muted-foreground space-y-1">
                <li className="flex items-center gap-2"><Database className="h-4 w-4 text-blue-500" /> Automatizar o envio de pedidos de compra e reabastecimento.</li>
                <li className="flex items-center gap-2"><TrendingDown className="h-4 w-4 text-green-500" /> Reduzir custos operacionais e de estoque.</li>
                <li className="flex items-center gap-2"><Scale className="h-4 w-4 text-yellow-500" /> Manter o estoque equilibrado e evitar rupturas.</li>
                <li>Receber atualizações de status de pedidos em tempo real.</li>
                <li>Sincronizar informações de catálogo, preços e disponibilidade.</li>
              </ul>
              <p className="text-lg font-semibold mt-6">
                Otimize sua cadeia de suprimentos e melhore a eficiência operacional!
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <Button variant="outline">
                  <Settings2 className="h-4 w-4 mr-2" /> Configurar Integrações
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Adicionar Novo Fornecedor
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default SupplierIntegration;