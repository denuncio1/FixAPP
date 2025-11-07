"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, Plus, Tag, X, ListChecks } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import WorkOrderCard from "@/components/WorkOrderCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import NewWorkOrderDialog from "@/components/NewWorkOrderDialog";
import WorkOrderDetailsDialog from "@/components/WorkOrderDetailsDialog";
import WorkOrderChecklistDialog from "@/components/WorkOrderChecklistDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkOrder, ActivityLogEntry } from "@/types/work-order";

const initialMockWorkOrders: WorkOrder[] = [
  {
    id: "#OS1017",
    status: "Pendente",
    client: "Mercatto Carolliine de Freitas Teixeira Isac LTDA",
    title: "Mesa com a perna quebrada",
    description: "parafusar a perna da mesa que está caindo",
    technician: "Carlos Turibio",
    date: "22/10/2025",
    priority: "Média",
    classification: "Corretiva",
    daysAgo: 14,
    tags: ["mobiliário", "urgente"],
    deadlineDate: "2025-11-05T23:59:59Z",
    activityHistory: [
      { timestamp: "2025-10-08T10:00:00Z", action: "OS Criada" },
    ],
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
    classification: "Preventiva",
    daysAgo: 15,
    tags: ["elétrica", "preventiva"],
    startTime: "2025-10-07T09:00:00Z",
    endTime: "2025-10-07T11:30:00Z",
    deadlineDate: "2025-10-25T23:59:59Z",
    startLocation: { lat: -23.561355, lng: -46.656003, timestamp: "2025-10-07T09:00:00Z" },
    endLocation: { lat: -23.561355, lng: -46.656003, timestamp: "2025-10-07T11:30:00Z" },
    activityHistory: [
      { timestamp: "2025-10-07T08:00:00Z", action: "OS Criada" },
      { timestamp: "2025-10-07T09:00:00Z", action: "Serviço Iniciado", location: { lat: -23.561355, lng: -46.656003, timestamp: "2025-10-07T09:00:00Z" } },
      { timestamp: "2025-10-07T11:30:00Z", action: "Serviço Concluído", location: { lat: -23.561355, lng: -46.656003, timestamp: "2025-10-07T11:30:00Z" } },
    ],
    checklist: { // Exemplo de checklist concluído
      items: [
        { id: "item1", description: "Verificação de segurança do equipamento", completed: true },
        { id: "item2", description: "Limpeza e lubrificação de componentes", completed: true },
        { id: "item3", description: "Teste de funcionalidade pós-manutenção", completed: true },
        { id: "item4", description: "Ajuste de parâmetros operacionais", completed: true },
        { id: "item5", description: "Descarte correto de resíduos", completed: true },
      ],
      photos: [
        { type: "image", url: "/placeholder.svg", filename: "foto1.jpg" },
      ],
      signatureName: "Nilson Denuncio",
      signatureDate: "2025-10-07T11:35:00Z",
      completedByTechnicianId: "tech2",
      completedByTechnicianName: "Nilson Denuncio",
    }
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
    classification: "Emergencial",
    daysAgo: 15,
    tags: ["emergência", "elétrica"],
    deadlineDate: "2024-12-20T23:59:59Z",
    activityHistory: [
      { timestamp: "2024-12-01T14:00:00Z", action: "OS Criada" },
    ],
  },
  {
    id: "#OS1025",
    status: "Pendente",
    client: "Indústria XYZ",
    title: "Reparo em linha de produção",
    description: "Motor da esteira com ruído estranho",
    technician: "N/A",
    date: "01/11/2024",
    priority: "Crítica",
    classification: "Corretiva",
    daysAgo: 5,
    tags: ["mecânica", "produção"],
    deadlineDate: "2024-11-10T23:59:59Z",
    activityHistory: [
      { timestamp: "2024-10-27T09:00:00Z", action: "OS Criada" },
    ],
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
    classification: "Preventiva",
    daysAgo: 8,
    tags: ["climatização", "instalação"],
    deadlineDate: "2024-11-01T23:59:59Z",
    activityHistory: [
      { timestamp: "2024-10-20T10:00:00Z", action: "OS Criada" },
    ],
  },
  {
    id: "#OS1027",
    status: "Crítica",
    client: "Prefeitura Municipal",
    title: "Reparo emergencial em semáforo",
    description: "Semáforo da Av. Principal com defeito, causando congestionamento.",
    technician: "Equipe de Emergência",
    date: "29/10/2024",
    priority: "Crítica",
    classification: "Emergencial",
    daysAgo: 1,
    tags: ["emergência", "trânsito"],
    deadlineDate: "2024-10-30T23:59:59Z",
    activityHistory: [
      { timestamp: "2024-10-28T16:00:00Z", action: "OS Criada" },
    ],
  },
  {
    id: "#OS1028",
    status: "Pendente",
    client: "Escola Primária",
    title: "Manutenção de bebedouros",
    description: "Bebedouros com vazamento e filtro entupido.",
    technician: "N/A",
    date: "05/11/2024",
    priority: "Baixa",
    classification: "Corretiva",
    daysAgo: 0,
    tags: ["hidráulica", "escola"],
    deadlineDate: "2024-11-15T23:59:59Z",
    activityHistory: [
      { timestamp: "2024-11-05T08:00:00Z", action: "OS Criada" },
    ],
  },
  {
    id: "#OS1029",
    status: "Cancelada",
    client: "Empresa de Logística",
    title: "Instalação de rastreador em veículo",
    description: "Instalação de dispositivo de rastreamento no veículo da frota.",
    technician: "João Silva",
    date: "01/11/2024",
    priority: "Média",
    classification: "Preventiva",
    daysAgo: 10,
    tags: ["veículo", "rastreamento"],
    deadlineDate: "2024-11-08T23:59:59Z",
    activityHistory: [
      { timestamp: "2024-10-22T10:00:00Z", action: "OS Criada" },
      { timestamp: "2024-11-01T14:00:00Z", action: "Serviço Cancelado", details: "Cliente solicitou o cancelamento." },
    ],
  },
];

const WorkOrders = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
  const [isChecklistDialogOpen, setIsChecklistDialogOpen] = useState(false);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialMockWorkOrders);
  const [selectedTagsFilter, setSelectedTagsFilter] = useState<string[]>([]);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedWorkOrderForDetails, setSelectedWorkOrderForDetails] = useState<WorkOrder | null>(null);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSaveNewOrder = (newOrder: WorkOrder) => {
    setWorkOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  const handleUpdateWorkOrder = (updatedOrder: WorkOrder) => {
    setWorkOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
    );
  };

  const handleOpenDetails = (order: WorkOrder) => {
    setSelectedWorkOrderForDetails(order);
    setIsDetailsDialogOpen(true);
  };

  const allAvailableTags = useMemo(() => {
    const tags = new Set<string>();
    workOrders.forEach((order) => {
      order.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [workOrders]);

  const filteredWorkOrders = workOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTags =
      selectedTagsFilter.length === 0 ||
      selectedTagsFilter.every((filterTag) =>
        order.tags.some((orderTag) => orderTag.toLowerCase() === filterTag.toLowerCase())
      );

    return matchesSearch && matchesTags;
  });

  const groupedWorkOrders = filteredWorkOrders.reduce((acc, order) => {
    if (!acc[order.status]) {
      acc[order.status] = [];
    }
    acc[order.status].push(order);
    return acc;
  }, {} as Record<WorkOrder['status'], WorkOrder[]>);

  const statusOrder: WorkOrder['status'][] = ["Pendente", "Em Andamento", "Crítica", "Concluída", "Cancelada"];

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

            <div className="flex gap-4 w-full md:w-auto">
              <Select
                onValueChange={(value) => {
                  if (value === "all") {
                    setSelectedTagsFilter([]);
                  } else if (!selectedTagsFilter.includes(value)) {
                    setSelectedTagsFilter([...selectedTagsFilter, value]);
                  }
                }}
                value={selectedTagsFilter.length > 0 ? selectedTagsFilter[selectedTagsFilter.length - 1] : "all"}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filtrar por Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Tags</SelectItem>
                  {allAvailableTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" /> {tag}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button className="flex items-center gap-2 w-full md:w-auto" onClick={() => setIsNewOrderDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Nova OS
              </Button>
              <Button variant="outline" className="flex items-center gap-2 w-full md:w-auto" onClick={() => setIsChecklistDialogOpen(true)}>
                <ListChecks className="h-4 w-4" />
                OS por Checklist
              </Button>
            </div>
          </div>

          {selectedTagsFilter.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="text-sm font-medium">Tags selecionadas:</span>
              {selectedTagsFilter.map((tag) => (
                <Button
                  key={tag}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setSelectedTagsFilter(selectedTagsFilter.filter((t) => t !== tag))}
                >
                  {tag} <X className="h-3 w-3" />
                </Button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statusOrder.map((status) => (
              <Card key={status} className="flex flex-col h-full bg-muted/40">
                <CardHeader className="border-b pb-3">
                  <CardTitle className="text-lg font-semibold">{status} ({groupedWorkOrders[status]?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-4 space-y-4 overflow-y-auto">
                  {groupedWorkOrders[status] && groupedWorkOrders[status].length > 0 ? (
                    groupedWorkOrders[status].map((order) => (
                      <WorkOrderCard key={order.id} {...order} onClick={() => handleOpenDetails(order)} />
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhuma ordem de serviço {status.toLowerCase()} encontrada.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
      <NewWorkOrderDialog
        isOpen={isNewOrderDialogOpen}
        onClose={() => setIsNewOrderDialogOpen(false)}
        onSave={handleSaveNewOrder}
      />
      <WorkOrderChecklistDialog
        isOpen={isChecklistDialogOpen}
        onClose={() => setIsChecklistDialogOpen(false)}
        onSave={handleSaveNewOrder}
      />
      {selectedWorkOrderForDetails && (
        <WorkOrderDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          workOrder={selectedWorkOrderForDetails}
          onUpdateWorkOrder={handleUpdateWorkOrder}
        />
      )}
    </div>
  );
};

export default WorkOrders;