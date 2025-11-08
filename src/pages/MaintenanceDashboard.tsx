"use client";

import React from "react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, Wrench, Package, Users, Home, FileText, Download, RefreshCw } from "lucide-react"; // Adicionado RefreshCw
import Sidebar from "@/components/Sidebar";
import KpiCards from "@/components/KpiCards";
import MaintenanceCharts from "@/components/MaintenanceCharts";
import DashboardKpiCards from "@/components/DashboardKpiCards"; // NOVO: Importar DashboardKpiCards
import ComplianceDonutChart from "@/components/ComplianceDonutChart"; // NOVO: Importar ComplianceDonutChart
import WorkOrdersBarChart from "@/components/WorkOrdersBarChart"; // NOVO: Importar WorkOrdersBarChart
import ServiceRequestsBarChart from "@/components/ServiceRequestsBarChart"; // NOVO: Importar ServiceRequestsBarChart
import { toast } from "sonner";
import AppLogo from "@/components/AppLogo";
import { Input } from "@/components/ui/input"; // Para o filtro de localização

const MaintenanceDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [locationFilter, setLocationFilter] = useState(""); // Estado para o filtro de localização

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Mock Data para KPIs existentes
  const mockKpis = {
    avgResponseTime: "3.5 horas",
    costPerWorkOrder: "R$ 150,00",
    assetAvailability: "98.5%",
  };

  // NOVO: Mock Data para os KPIs do Dashboard da imagem
  const mockDashboardKpis = {
    ossInVerification: 15,
    ossConcluidas: 74,
    tarefasAtrasadas: 12,
    paradasPlanejadas: 8,
    paradasNaoPlanejadas: 3,
    ativosParados: 5, // Exemplo
    severidadeFalhas: "Média",
  };

  // NOVO: Mock Data para o gráfico de cumprimento
  const mockCompliancePercentage = 51.0;

  // NOVO: Mock Data para o gráfico de Ordens de Serviço
  const mockWorkOrdersChartData = [
    { name: "Total", "OSs Criadas": 49, "OSs Finalizadas": 25, "OSs Pendentes": 24 },
  ];

  // NOVO: Mock Data para o gráfico de Solicitações de Serviços
  const mockServiceRequestsChartData = [
    { name: "Total", Criado: 14, Solucionado: 1 },
  ];

  const handleExportReport = (format: string) => {
    toast.info(`Funcionalidade de exportação para ${format} em desenvolvimento.`);
    console.log(`Exportar relatório em formato: ${format}`);
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
          <AppLogo className="h-12 w-auto mr-4" />
          <h1 className="text-xl font-semibold flex items-center gap-2 flex-1">
            Painel de Controle
          </h1>
          {/* NOVO: Filtro de Localização no Header */}
          <div className="flex items-center gap-2 ml-auto">
            <Input
              placeholder="Localização ou parte de"
              className="w-[200px]"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
            <Button variant="ghost" size="icon">
              <RefreshCw className="h-5 w-5" />
            </Button>
            {/* Outros ícones do header da imagem podem ser adicionados aqui */}
            <AppLogo className="h-8 w-auto ml-4" /> {/* Logo à direita do título */}
          </div>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Visão Geral e Relatórios</h2>
            <p className="text-muted-foreground">
              Acompanhe os principais indicadores e visualize o desempenho da manutenção.
            </p>
          </div>

          {/* NOVO: Seção de KPIs do Dashboard da imagem */}
          <div className="mb-8">
            <DashboardKpiCards
              ossInVerification={mockDashboardKpis.ossInVerification}
              ossConcluidas={mockDashboardKpis.ossConcluidas}
              tarefasAtrasadas={mockDashboardKpis.tarefasAtrasadas}
              paradasPlanejadas={mockDashboardKpis.paradasPlanejadas}
              paradasNaoPlanejadas={mockDashboardKpis.paradasNaoPlanejadas}
              ativosParados={mockDashboardKpis.ativosParados}
              severidadeFalhas={mockDashboardKpis.severidadeFalhas}
            />
          </div>

          {/* NOVO: Gráficos do Dashboard da imagem */}
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 mb-8">
            <ComplianceDonutChart compliancePercentage={mockCompliancePercentage} />
            <WorkOrdersBarChart data={mockWorkOrdersChartData} />
            <ServiceRequestsBarChart data={mockServiceRequestsChartData} />
          </div>

          {/* Seção de KPIs (existente) */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6" /> Indicadores Chave de Desempenho (KPIs)
            </h3>
            <KpiCards kpis={mockKpis} />
          </div>

          {/* Seção de Gráficos Interativos (existente) */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Wrench className="h-6 w-6" /> Análise de Manutenção
            </h3>
            <MaintenanceCharts />
          </div>

          {/* Seção de Exportação de Relatórios (existente) */}
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