"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkRequest, ActivityLogEntry, ChecklistMedia, WorkOrder } from "@/types/work-order";
import { cn } from "@/lib/utils";
import { FileText, History, QrCode, Image as ImageIcon, Video, CheckCircle, AlertTriangle, Ban, Wrench, SearchCheck, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import NewWorkOrderDialog from "./NewWorkOrderDialog"; // Importar o diálogo de nova OS

interface WorkRequestDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workRequest: WorkRequest;
  mockAssets: { id: string; name: string }[];
  onUpdateRequest: (updatedRequest: WorkRequest) => void; // Novo prop para atualizar a solicitação
  onGenerateWorkOrder: (newOrder: WorkOrder) => void; // Novo prop para gerar OS
}

const WorkRequestDetailsDialog: React.FC<WorkRequestDetailsDialogProps> = ({
  isOpen,
  onClose,
  workRequest,
  mockAssets,
  onUpdateRequest,
  onGenerateWorkOrder,
}) => {
  const [currentWorkRequest, setCurrentWorkRequest] = useState<WorkRequest>(workRequest);
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
  const [newOrderInitialData, setNewOrderInitialData] = useState<Partial<WorkOrder> | undefined>(undefined);

  // Atualiza o estado interno se o prop workRequest mudar
  React.useEffect(() => {
    setCurrentWorkRequest(workRequest);
  }, [workRequest]);

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const getStatusBadgeClass = (status: WorkRequest['status']) => {
    switch (status) {
      case "Aberto":
        return "bg-blue-100 text-blue-800";
      case "Em Análise":
        return "bg-yellow-100 text-yellow-800";
      case "OS Gerada":
        return "bg-green-100 text-green-800";
      case "Rejeitada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: WorkRequest['status']) => {
    switch (status) {
      case "Aberto":
        return <FileText className="h-4 w-4 mr-1" />;
      case "Em Análise":
        return <AlertTriangle className="h-4 w-4 mr-1" />;
      case "OS Gerada":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "Rejeitada":
        return <Ban className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const getAssetName = (assetId?: string) => {
    if (!assetId) return "N/A";
    return mockAssets.find(asset => asset.id === assetId)?.name || assetId;
  };

  const updateRequestStatus = (newStatus: WorkRequest['status'], action: string, details?: string) => {
    const now = new Date().toISOString();
    const newActivity: ActivityLogEntry = {
      timestamp: now,
      action: action,
      details: details,
    };
    const updatedRequest: WorkRequest = {
      ...currentWorkRequest,
      status: newStatus,
      activityLog: [...currentWorkRequest.activityLog, newActivity],
    };
    setCurrentWorkRequest(updatedRequest);
    onUpdateRequest(updatedRequest); // Notifica o componente pai
    toast.success(`Solicitação ${currentWorkRequest.id} marcada como "${newStatus}".`);
  };

  const handleMarkInAnalysis = () => {
    if (currentWorkRequest.status === "Aberto") {
      updateRequestStatus("Em Análise", "Solicitação em Análise", "A solicitação está sendo revisada.");
    } else {
      toast.info("A solicitação já está em análise ou já foi processada.");
    }
  };

  const handleRejectRequest = () => {
    if (currentWorkRequest.status !== "OS Gerada" && currentWorkRequest.status !== "Rejeitada") {
      updateRequestStatus("Rejeitada", "Solicitação Rejeitada", "A solicitação foi rejeitada.");
    } else {
      toast.info("A solicitação já foi processada e não pode ser rejeitada.");
    }
  };

  const handleGenerateWorkOrder = () => {
    if (currentWorkRequest.status === "OS Gerada") {
      toast.info("Uma Ordem de Serviço já foi gerada para esta solicitação.");
      return;
    }

    // Prepara os dados para o NewWorkOrderDialog
    const initialData: Partial<WorkOrder> = {
      client: currentWorkRequest.createdBy, // Ou um cliente padrão/selecionável
      title: `OS para: ${currentWorkRequest.assetName || "Ativo Desconhecido"} - ${currentWorkRequest.description.substring(0, 50)}...`,
      description: `Gerada a partir da Solicitação de Trabalho ${currentWorkRequest.id}:\n${currentWorkRequest.description}`,
      assetId: currentWorkRequest.assetId,
      assetName: currentWorkRequest.assetName,
      priority: "Média", // Pode ser ajustado
      classification: "Corretiva", // Pode ser ajustado
      tags: ["solicitação", "automática"],
      // Outros campos podem ser preenchidos ou deixados para o usuário
    };
    setNewOrderInitialData(initialData);
    setIsNewOrderDialogOpen(true);
  };

  const handleSaveNewOrder = (newOrder: WorkOrder) => {
    onGenerateWorkOrder(newOrder); // Passa a nova OS para o componente pai
    updateRequestStatus("OS Gerada", "OS Gerada", `Ordem de Serviço ${newOrder.id} criada.`);
    setCurrentWorkRequest(prev => ({ ...prev, generatedWorkOrderId: newOrder.id })); // Atualiza o ID da OS gerada
    setIsNewOrderDialogOpen(false);
    onClose(); // Fecha o diálogo de detalhes da solicitação
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Detalhes da Solicitação <Badge>{currentWorkRequest.id}</Badge>
            </DialogTitle>
            <DialogDescription>
              Informações completas e histórico da solicitação de trabalho.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 p-4 -mx-4">
            <div className="grid gap-4 py-4 px-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="text-lg font-semibold">Solicitação de {getAssetName(currentWorkRequest.assetId)}</h3>
                <Badge className={cn("px-2 py-1 text-sm font-medium flex items-center", getStatusBadgeClass(currentWorkRequest.status))}>
                  {getStatusIcon(currentWorkRequest.status)} {currentWorkRequest.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">{currentWorkRequest.description}</p>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Criado por:</span> {currentWorkRequest.createdBy}</p>
                  <p><span className="font-medium">Data de Criação:</span> {formatDateTime(currentWorkRequest.createdAt)}</p>
                </div>
                <div>
                  <p><span className="font-medium">Ativo Relacionado:</span> {getAssetName(currentWorkRequest.assetId)}</p>
                  {currentWorkRequest.generatedWorkOrderId && (
                    <p><span className="font-medium">OS Gerada:</span> {currentWorkRequest.generatedWorkOrderId}</p>
                  )}
                </div>
              </div>

              {currentWorkRequest.attachments && currentWorkRequest.attachments.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" /> Anexos
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {currentWorkRequest.attachments.map((media, index) => (
                        <div key={index} className="relative">
                          {media.type === 'image' ? (
                            <img src={media.url} alt={media.filename} className="h-24 w-full object-cover rounded-md border" />
                          ) : (
                            <video src={media.url} controls className="h-24 w-full object-cover rounded-md border" />
                          )}
                          <span className="absolute bottom-1 left-1 text-xs text-white bg-black/50 px-1 rounded">
                            {media.filename}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <h4 className="text-md font-semibold flex items-center gap-2"><History className="h-4 w-4" /> Histórico de Atividades:</h4>
              <ul className="space-y-2 text-sm">
                {currentWorkRequest.activityLog.length > 0 ? (
                  currentWorkRequest.activityLog.map((activity, index) => (
                    <li key={index} className="border-l-2 pl-3">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-muted-foreground text-xs">{formatDateTime(activity.timestamp)}</p>
                      {activity.details && <p className="text-muted-foreground text-xs">{activity.details}</p>}
                    </li>
                  ))
                ) : (
                  <p className="text-muted-foreground">Nenhuma atividade registrada.</p>
                )}
              </ul>
            </div>
          </ScrollArea>

          <DialogFooter className="pt-4 flex flex-col sm:flex-row sm:justify-end sm:space-x-2">
            <div className="flex gap-2 w-full sm:w-auto mb-2 sm:mb-0">
              {currentWorkRequest.status === "Aberto" && (
                <Button variant="outline" onClick={handleMarkInAnalysis} className="w-full sm:w-auto">
                  <SearchCheck className="h-4 w-4 mr-2" /> Marcar como Em Análise
                </Button>
              )}
              {(currentWorkRequest.status === "Aberto" || currentWorkRequest.status === "Em Análise") && (
                <Button onClick={handleGenerateWorkOrder} className="w-full sm:w-auto">
                  <Wrench className="h-4 w-4 mr-2" /> Gerar OS
                </Button>
              )}
              {(currentWorkRequest.status === "Aberto" || currentWorkRequest.status === "Em Análise") && (
                <Button variant="destructive" onClick={handleRejectRequest} className="w-full sm:w-auto">
                  <XCircle className="h-4 w-4 mr-2" /> Rejeitar
                </Button>
              )}
            </div>
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isNewOrderDialogOpen && (
        <NewWorkOrderDialog
          isOpen={isNewOrderDialogOpen}
          onClose={() => setIsNewOrderDialogOpen(false)}
          onSave={handleSaveNewOrder}
          initialData={newOrderInitialData}
        />
      )}
    </>
  );
};

export default WorkRequestDetailsDialog;