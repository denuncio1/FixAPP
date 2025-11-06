"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const WorkOrders = () => {
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
          <h1 className="text-xl font-semibold">Ordens de Serviço</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Lista de Ordens de Serviço</h2>
            <Button>Nova Ordem de Serviço</Button>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-sm">
            <p className="text-muted-foreground">Nenhuma ordem de serviço encontrada. Crie uma nova!</p>
            {/* Aqui você pode adicionar uma tabela ou lista de ordens de serviço */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkOrders;