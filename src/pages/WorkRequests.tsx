"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, Plus, QrCode, Image as ImageIcon, Video, FileText, History, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { WorkRequest, ChecklistMedia, ActivityLogEntry } from "@/types/work-order";
import WorkRequestDetailsDialog from "@/components/WorkRequestDetailsDialog"; // Importar o novo diálogo
import NewWorkRequestDialog from "@/components/NewWorkRequestDialog"; // Importar o novo componente de diálogo

// Mock Data para Ativos (para simular a seleção via QR Code)
const mockAssets = [
  { id: "asset1", name: "Máquina de Produção X" },
  { id: "asset2", name: "Compressor Principal" },
  { id: "asset3", name: "Painel Solar 01" },
  { id: "asset4", name: "Sistema HVAC-01" },
];

const initialMockWorkRequests: WorkRequest[] = [
  {
    id: "SR307",
    status: "Em Análise",
    createdBy: "Abelardo Oropeza",
    createdAt: "2024-04-15T05:30:00Z",
    description: "Equipamento no enciende",
    assetId: "asset3",
    assetName: "Painel Solar 01",
    attachments: [
      { type: "image", url: "/placeholder.svg", filename: "painel_solar_problema.jpg" },
    ],
    activityLog: [
      { timestamp: "2024-04-15T05:27:00Z", action: "Aberto", details: "Equipamento no enciende" },
      { timestamp: "2024-04-15T05:29:00Z", action: "Espera por uma OS", details: "Aguardando criação de Ordem de Serviço" },
      { timestamp: "2024-04-15T05:30:00Z", action: "OSs em Processo", details: "Ordem de Serviço #OS1035 gerada" },
    ],
    generatedWorkOrderId: "#OS1035",
  },
  {
    id: "SR308",
    status: "Aberto",
    createdBy: "Maria Silva",
    createdAt: "2024-11-06T10:15:00Z",
    description: "Vazamento na tubulação do banheiro do 2º andar.",
    assetId: "asset4",
    assetName: "Sistema HVAC-01",
    attachments: [],
    activityLog: [
      { timestamp: "2024-11-06T10:15:00Z", action: "Aberto", details: "Vazamento detectado" },
    ],
  },
];

const WorkRequests = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedWorkRequestForDetails, setSelectedWorkRequestForDetails] = useState<WorkRequest | null>(null);
  const [workRequests, setWorkRequests] = useState<WorkRequest[]>(initialMockWorkRequests); // Adicionado useState aqui

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSaveNewRequest = (newRequest: WorkRequest) => {
    setWorkRequests((prev) => [newRequest, ...prev]);
    toast.success("Solicitação de Trabalho criada com sucesso!");
  };

  const handleOpenDetails = (request: WorkRequest) => {
    setSelectedWorkRequestForDetails(request);
    setIsDetailsDialogOpen(true);
  };

  const filteredWorkRequests = workRequests.filter((request) =>
    request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.assetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
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
          <h1 className="text-xl font-semibold">Solicitações de Trabalho</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Gerenciar Solicitações de Trabalho</h2>
            <p className="text-muted-foreground">
              Crie e acompanhe solicitações de trabalho para manutenção e serviços.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, descrição ou ativo..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button className="flex items-center gap-2 w-full md:w-auto" onClick={() => setIsNewRequestDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Nova Solicitação
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Solicitações</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ativo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Criado Por</TableHead>
                    <TableHead className="text-right">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkRequests.length > 0 ? (
                    filteredWorkRequests.map((request) => (
                      <TableRow key={request.id} onClick={() => handleOpenDetails(request)} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              request.status === "Aberto"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100/80"
                                : request.status === "Em Análise"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
                                : request.status === "OS Gerada"
                                ? "bg-green-100 text-green-800 hover:bg-green-100/80"
                                : "bg-red-100 text-red-800 hover:bg-red-100/80"
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{request.assetName || "N/A"}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{request.description}</TableCell>
                        <TableCell>{request.createdBy}</TableCell>
                        <TableCell className="text-right">{formatDateTime(request.createdAt)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                        Nenhuma solicitação de trabalho encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Diálogo para Nova Solicitação */}
      <NewWorkRequestDialog
        isOpen={isNewRequestDialogOpen}
        onClose={() => setIsNewRequestDialogOpen(false)}
        onSave={handleSaveNewRequest}
      />

      {/* Diálogo de Detalhes da Solicitação */}
      {selectedWorkRequestForDetails && (
        <WorkRequestDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          workRequest={selectedWorkRequestForDetails}
          mockAssets={mockAssets} // Passar mockAssets para o diálogo
        />
      )}
    </div>
  );
};

export default WorkRequests;