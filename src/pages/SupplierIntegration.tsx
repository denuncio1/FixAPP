"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Menu, Link as LinkIcon, Settings2, Plus } from "lucide-react";
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
                <LinkIcon className="h-6 w-6" /> Funcionalidade em Desenvolvimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Esta seção permitirá a configuração de integrações diretas com sistemas de fornecedores para:
              </p>
              <ul className="list-disc list-inside text-left text-muted-foreground space-y-1">
                <li>Automatizar o envio de pedidos de compra.</li>
                <li>Receber atualizações de status de pedidos.</li>
                <li>Sincronizar informações de catálogo e preços.</li>
                <li>Receber notificações de disponibilidade de estoque dos fornecedores.</li>
              </ul>
              <p className="text-lg font-semibold mt-6">
                Fique atento para futuras atualizações!
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