"use client";

import React, { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { WorkOrder, LocationData, ActivityLogEntry, WorkOrderChecklist } from "@/types/work-order";
import { cn } from "@/lib/utils";
import { MapPin, Clock, Play, Square, History, Ban, ListChecks, Camera, Video, Signature, CheckCircle, AlertTriangle } from "lucide-react"; // 'Ban' adicionado para cancelar, CheckCircle e AlertTriangle para status
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import WorkOrderExecutionChecklistDialog from "./WorkOrderExecutionChecklistDialog"; // Importar o novo componente

interface WorkOrderDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: WorkOrder;
  onUpdateWorkOrder: (updatedOrder: WorkOrder) => void;
}

const WorkOrderDetailsDialog: React.FC<WorkOrderDetailsDialogProps> = ({
  isOpen,
  onClose,
  workOrder,
  onUpdateWorkOrder,
}) => {
  const [currentOrder, setCurrentOrder] = useState<WorkOrder>(workOrder);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  useEffect(() => {
    setCurrentOrder(workOrder);
  }, [workOrder]);

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const formatDateOnly = (isoString?: string) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  const getLocation = async (): Promise<LocationData | undefined> => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              timestamp: new Date().toISOString(),
            });
          },
          (error) => {
            console.error("Erro ao obter localização:", error);
            toast.warning("Não foi possível obter a localização atual. Usando localização simulada.");
            resolve({
              lat: -23.55052,
              lng: -46.633307,
              timestamp: new Date().toISOString(),
              address: "Localização Simulada (São Paulo)",
            });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        toast.warning("Geolocalização não suportada pelo navegador. Usando localização simulada.");
        resolve({
          lat: -23.55052,
          lng: -46.633307,
          timestamp: new Date().toISOString(),
          address: "Localização Simulada (São Paulo)",
        });
      }
    });
  };

  const handleStartService = async () => {
    if (currentOrder.status === "Em Andamento") {
      toast.info("O serviço já está em andamento.");
      return;
    }
    if (currentOrder.status === "Concluída" || currentOrder.status === "Cancelada") {
      toast.error("Não é possível iniciar um serviço já concluído ou cancelado.");
      return;
    }

    const now = new Date().toISOString();
    const location = await getLocation();

    const newActivity: ActivityLogEntry = {
      timestamp: now,
      action: "Serviço Iniciado",
      location: location,
      details: `Técnico ${currentOrder.technician} iniciou o serviço.`,
    };

    const updatedOrder: WorkOrder = {
      ...currentOrder,
      status: "Em Andamento",
      startTime: now,
      startLocation: location,
      activityHistory: [...currentOrder.activityHistory, newActivity],
    };
    setCurrentOrder(updatedOrder);
    onUpdateWorkOrder(updatedOrder);
    toast.success("Serviço iniciado com sucesso!");
  };

  const handleEndService = async () => {
    if (currentOrder.status !== "Em Andamento") {
      toast.info("O serviço não está em andamento para ser finalizado.");
      return;
    }
    if (!currentOrder.checklist) {
      toast.error("Por favor, preencha o checklist de execução antes de finalizar o serviço.");
      setIsChecklistOpen(true); // Abre o checklist para o usuário preencher
      return;
    }

    const now = new Date().toISOString();
    const location = await getLocation();

    const newActivity: ActivityLogEntry = {
      timestamp: now,
      action: "Serviço Concluído",
      location: location,
      details: `Técnico ${currentOrder.technician} finalizou o serviço.`,
    };

    const updatedOrder: WorkOrder = {
      ...currentOrder,
      status: "Concluída",
      endTime: now,
      endLocation: location,
      activityHistory: [...currentOrder.activityHistory, newActivity],
    };
    setCurrentOrder(updatedOrder);
    onUpdateWorkOrder(updatedOrder);
    toast.success("Serviço finalizado com sucesso!");
  };

  const handleCancelService = async () => {
    if (currentOrder.status === "Concluída" || currentOrder.status === "Cancelada") {
      toast.error("Não é possível cancelar um serviço já concluído ou já cancelado.");
      return;
    }

    const now = new Date().toISOString();
    const newActivity: ActivityLogEntry = {
      timestamp: now,
      action: "Serviço Cancelado",
      details: `Ordem de serviço cancelada.`,
    };

    const updatedOrder: WorkOrder = {
      ...currentOrder,
      status: "Cancelada",
      activityHistory: [...currentOrder.activityHistory, newActivity],
    };
    setCurrentOrder(updatedOrder);
    onUpdateWorkOrder(updatedOrder);
    toast.info("Ordem de Serviço cancelada.");
  };

  const handleSaveChecklist = (checklistData: WorkOrderChecklist) => {
    const updatedOrder: WorkOrder = {
      ...currentOrder,
      checklist: checklistData,
    };
    setCurrentOrder(updatedOrder);
    onUpdateWorkOrder(updatedOrder);
    toast.success("Checklist salvo na Ordem de Serviço.");
  };

  const getStatusIcon = (status: WorkOrder['status']) => {
    switch (status) {
      case "Pendente":
        return <Clock className="h-4 w-4 mr-1" />;
      case "Em Andamento":
        return <Play className="h-4 w-4 mr-1" />;
      case "Concluída":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "Crítica":
        return <AlertTriangle className="h-4 w-4 mr-1" />;
      case "Cancelada":
        return <Ban className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalhes da Ordem de Serviço <Badge>{currentOrder.id}</Badge>
          </DialogTitle>
          <DialogDescription>
            Informações completas e histórico da ordem de serviço.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4 -mx-4">
          <div className="grid gap-4 py-4 px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="text-lg font-semibold">{currentOrder.title}</h3>
              <Badge
                className={cn(
                  "px-2 py-1 text-sm font-medium flex items-center",
                  currentOrder.status === "Pendente" && "bg-yellow-100 text-yellow-800",
                  currentOrder.status === "Em Andamento" && "bg-blue-100 text-blue-800",
                  currentOrder.status === "Concluída" && "bg-green-100 text-green-800",
                  currentOrder.status === "Crítica" && "bg-red-100 text-red-800",
                  currentOrder.status === "Cancelada" && "bg-gray-300 text-gray-800",
                )}
              >
                {getStatusIcon(currentOrder.status)} {currentOrder.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{currentOrder.description}</p>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-medium">Cliente:</span> {currentOrder.client}</p>
                <p><span className="font-medium">Técnico:</span> {currentOrder.technician || "N/A"}</p>
                <p><span className="font-medium">Data Criação:</span> {currentOrder.date}</p>
              </div>
              <div>
                <p><span className="font-medium">Prioridade:</span> {currentOrder.priority}</p>
                <p><span className="font-medium">Classificação:</span> {currentOrder.classification}</p>
                <p><span className="font-medium">Prazo:</span> {formatDateOnly(currentOrder.deadlineDate)}</p>
                <p><span className="font-medium">Criada há:</span> {currentOrder.daysAgo} dias</p>
              </div>
            </div>

            {currentOrder.tags && currentOrder.tags.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="font-medium mb-1">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {currentOrder.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            <h4 className="text-md font-semibold flex items-center gap-2"><Clock className="h-4 w-4" /> Tempos e Localizações:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-medium">Início do Serviço:</span> {formatDateTime(currentOrder.startTime)}</p>
                {currentOrder.startLocation && (
                  <p className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {currentOrder.startLocation.address || `Lat: ${currentOrder.startLocation.lat.toFixed(4)}, Lng: ${currentOrder.startLocation.lng.toFixed(4)}`}
                  </p>
                )}
              </div>
              <div>
                <p><span className="font-medium">Fim do Serviço:</span> {formatDateTime(currentOrder.endTime)}</p>
                {currentOrder.endLocation && (
                  <p className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {currentOrder.endLocation.address || `Lat: ${currentOrder.endLocation.lat.toFixed(4)}, Lng: ${currentOrder.endLocation.lng.toFixed(4)}`}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Seção do Checklist de Execução */}
            <div>
              <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                <ListChecks className="h-4 w-4" /> Checklist de Execução
              </h4>
              {currentOrder.checklist ? (
                <div className="space-y-3">
                  <p className="text-sm">
                    <span className="font-medium">Concluído por:</span> {currentOrder.checklist.signatureName} em{" "}
                    {formatDateTime(currentOrder.checklist.signatureDate)}
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {currentOrder.checklist.items.map((item) => (
                      <li key={item.id} className={item.completed ? "line-through text-green-600" : "text-red-600"}>
                        {item.description} {item.completed ? "(Concluído)" : "(Pendente)"}
                      </li>
                    ))}
                  </ul>
                  {currentOrder.checklist.photos && currentOrder.checklist.photos.length > 0 && (
                    <>
                      <p className="font-medium mt-4">Fotos:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {currentOrder.checklist.photos.map((media) => (
                          <img key={media.url} src={media.url} alt={media.filename} className="h-20 w-full object-cover rounded-md border" />
                        ))}
                      </div>
                    </>
                  )}
                  {currentOrder.checklist.videos && currentOrder.checklist.videos.length > 0 && (
                    <>
                      <p className="font-medium mt-4">Vídeos:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {currentOrder.checklist.videos.map((media) => (
                          <video key={media.url} src={media.url} controls className="h-20 w-full object-cover rounded-md border" />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Nenhum checklist de execução preenchido.</p>
              )}
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => setIsChecklistOpen(true)}
                disabled={currentOrder.status === "Concluída" || currentOrder.status === "Cancelada"}
              >
                <ListChecks className="h-4 w-4 mr-2" /> {currentOrder.checklist ? "Ver/Editar Checklist" : "Preencher Checklist"}
              </Button>
            </div>

            <Separator />

            <h4 className="text-md font-semibold flex items-center gap-2"><History className="h-4 w-4" /> Histórico de Atividades:</h4>
            <ul className="space-y-2 text-sm">
              {currentOrder.activityHistory.length > 0 ? (
                currentOrder.activityHistory.map((activity, index) => (
                  <li key={index} className="border-l-2 pl-3">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-muted-foreground text-xs">{formatDateTime(activity.timestamp)}</p>
                    {activity.location && (
                      <p className="flex items-center gap-1 text-muted-foreground text-xs">
                        <MapPin className="h-3 w-3" /> {activity.location.address || `Lat: ${activity.location.lat.toFixed(4)}, Lng: ${activity.location.lng.toFixed(4)}`}
                      </p>
                    )}
                    {activity.details && <p className="text-muted-foreground text-xs">{activity.details}</p>}
                  </li>
                ))
              ) : (
                <p className="text-muted-foreground">Nenhuma atividade registrada.</p>
              )}
            </ul>
          </div>
        </ScrollArea>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end sm:space-x-2 pt-4">
          <div className="flex gap-2 w-full sm:w-auto mb-2 sm:mb-0">
            <Button
              variant="outline"
              onClick={handleStartService}
              disabled={currentOrder.status === "Em Andamento" || currentOrder.status === "Concluída" || currentOrder.status === "Cancelada"}
              className="w-full sm:w-auto"
            >
              <Play className="h-4 w-4 mr-2" /> Iniciar Serviço
            </Button>
            <Button
              variant="destructive"
              onClick={handleEndService}
              disabled={currentOrder.status !== "Em Andamento"}
              className="w-full sm:w-auto"
            >
              <Square className="h-4 w-4 mr-2" /> Finalizar Serviço
            </Button>
            <Button
              variant="secondary"
              onClick={handleCancelService}
              disabled={currentOrder.status === "Concluída" || currentOrder.status === "Cancelada"}
              className="w-full sm:w-auto"
            >
              <Ban className="h-4 w-4 mr-2" /> Cancelar Serviço
            </Button>
          </div>
          <Button onClick={onClose} className="w-full sm:w-auto">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>

      {isChecklistOpen && (
        <WorkOrderExecutionChecklistDialog
          isOpen={isChecklistOpen}
          onClose={() => setIsChecklistOpen(false)}
          workOrder={currentOrder}
          onSaveChecklist={handleSaveChecklist}
        />
      )}
    </Dialog>
  );
};

export default WorkOrderDetailsDialog;