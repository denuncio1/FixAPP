"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Search, Filter, Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import WorkOrderCard from "@/components/WorkOrderCard"; // Importar o novo componente

interface WorkOrder {
  id: string;
  status: "Pendente" | "Concluída" | "Crítica";
  client: string;
  title: string;
  description: string;
  technician: string;
  date: string;
  priority: "Baixa" | "Média" | "Crítica";
  daysAgo: number;
}

const mockWorkOrders: WorkOrder[] = [
  {
    id: "#OS1017",
    status: "Pendente",
    client: "Mercatto Carolliine de Freitas Teixeira Isac LTDA",
    title: "Mesa com a perna quebrada",
    description: "parafusar a perna da mesa que está caindo",
    technician: "Carlos Turibio",
    date: "22/10/2025",
    priority: "Média",
    daysAgo: 14,
  },
  {
    id: "#OS1020",
    status: "Concluída",
    client: "Empresa ABC Ltda",
    title: "Manutenção preventiva em gerador",
    description: "Troca de óleo e filtros do gerador principal",
    technician: "Nilson Denuncio",
    date: "22/10/2025",
    priority: "Média",
    daysAgo: 15,
  },
  {
    id: "#OS1024",
    status: "Pendente",
    client: "Hospital São Lucas",
    title: "Manutenção corretiva - grupo gerador",
    description: "Falha no sistema de partida automática",
    technician: "N/A",
    date: "16/12/2024",
    priority: "Crítica",
    daysAgo: 15,
  },
  {
    id: "#OS1025",
    status: "Pendente",
    client: "Indústria XYZ",
    title: "Reparo em linha de produção",
    description: "Motor da esteira com ruído estranho",
    technician: "Ana Paula",
    date: "01/11/2024",
    priority: "Crítica",
    daysAgo: 5,
  },
  {
    id: "#OS1026",
    status: "Concluída",
    client: "Comércio Local",
    title: "Instalação de novo ar condicionado",
    description: "Instalação e teste de novo equipamento de climatização",
    technician: "João Silva",
    date: "28/10/2024",
    priority: "Baixa",
    daysAgo: 8,
  },
];

const WorkOrders = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos Status");

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const filteredWorkOrders = mockWorkOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "Todos Status" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

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
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Ordens de Serviço</h2>
            <p className="text-muted-foreground">
              Gerencie as ordens de serviço e manutenções
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, cliente ou título..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="h-4 w-4" />
                    {filterStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterStatus("Todos Status")}>
                    Todos Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("Pendente")}>
                    Pendente
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("Concluída")}>
                    Concluída
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("Crítica")}>
                    Crítica
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button className="flex items-center gap-2 w-full md:w-auto">
                <Plus className="h-4 w-4" />
                Nova OS
              </Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredWorkOrders.length > 0 ? (
              filteredWorkOrders.map((order) => (
                <WorkOrderCard key={order.id} {...order} />
              ))
            ) : (
              <p className="text-muted-foreground col-span-full text-center">
                Nenhuma ordem de serviço encontrada com os critérios atuais.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkOrders;