"use client";

import React from "react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, Wrench, Package, Users, Home, FileText, Download } from "lucide-react"; // Adicionado FileText, Download
import Sidebar from "@/components/Sidebar";
import KpiCards from "@/components/KpiCards"; // Nova importação
import MaintenanceCharts from "@/components/MaintenanceCharts"; // Nova importação
import { toast } from "sonner"; // Importar toast para notificações
import AppLogo from "@/components/AppLogo"; // Importar AppLogo

const MaintenanceDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Mock Data para KPIs
  const mockKpis = {
    avgResponseTime: "3.5 horas",
    costPerWorkOrder: "R$ 150,00",
    assetAvailability: "98.5%",
  };

  const handleExportReport = (format: string) => {
    toast.info(`Funcionalidade de exportação para ${format} em desenvolvimento.`);
    console.log(`Exportar relatório em formato: ${format}`);
    // Aqui seria a lógica para chamar um serviço de exportação (backend ou biblioteca cliente)
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b bg-card px-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <AppLogo className="h-12 w-auto mr-4" /> {/* Logo à esquerda, mais proeminente */}
          <h1 className="text-xl font-semibold flex items-center gap-2 flex-1 justify-between">
            <span>Painel de Manutenção e Relatórios</span>
            <AppLogo className="h-8 w-auto ml-2" /> {/* Logo à direita do título */}
          </h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Visão Geral e Relatórios</h2>
            <p className="text-muted-foreground">
              Acompanhe os principais indicadores e visualize o desempenho da manutenção.
            </p>
          </div>

          {/* Seção de KPIs */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6" /> Indicadores Chave de Desempenho (KPIs)
            </h3>
            <KpiCards kpis={mockKpis} />
          </div>

          {/* Seção de Gráficos Interativos */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Wrench className="h-6 w-6" /> Análise de Manutenção
            </h3>
            <MaintenanceCharts />
          </div>

          {/* Seção de Exportação de Relatórios */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Download className="h-6 w-6" /> Exportar Relatórios
            </h3>
            <Card>
              <CardHeader>
                <CardTitle>Opções de Exportação</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button onClick={() => handleExportReport("PDF")}>
                  Exportar para PDF
                </Button>
                <Button onClick={() => handleExportReport("Excel")}>
                  Exportar para Excel
                </Button>
                <Button variant="outline" onClick={() => handleExportReport("BI")}>
                  Integrar com BI (API)
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Manter as atividades recentes e próximas manutenções, se desejar */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <span className="font-medium">OS #1001</span> - Reparo na
                    Máquina X (Concluído)
                  </li>
                  <li>
                    <span className="font-medium">OS #1002</span> - Inspeção do
                    Ativo Y (Pendente)
                  </li>
                  <li>
                    <span className="font-medium">OS #1003</span> - Manutenção
                    Preventiva Z (Em Andamento)
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Próximas Manutenções</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <span className="font-medium">2024-10-26</span> - Máquina A
                    (Preventiva)
                  </li>
                  <li>
                    <span className="font-medium">2024-10-28</span> - Veículo B
                    (Inspeção)
                  </li>
                  <li>
                    <span className="font-medium">2024-11-01</span> - Equipamento
                    C (Calibração)
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;