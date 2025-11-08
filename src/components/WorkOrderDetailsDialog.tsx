"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { WorkOrder, LocationData, ActivityLogEntry, WorkOrderChecklist } from "@/types/work-order";
import WorkOrderExecutionChecklistDialog from "./WorkOrderExecutionChecklistDialog";
import WorkOrderCompletionActionsDialog from "./WorkOrderCompletionActionsDialog";
import { saveWorkOrderOffline, getWorkOrderOffline, removeWorkOrderOffline } from "@/utils/offlineWorkOrderStorage";

// Importar os novos componentes modulares
import WorkOrderDetailsHeader from "./work-order-details/WorkOrderDetailsHeader.tsx";
import WorkOrderMainDetails from "./work-order-details/WorkOrderMainDetails.tsx";
import WorkOrderTimesAndLocations from "./work-order-details/WorkOrderTimesAndLocations.tsx";
import WorkOrderChecklistDisplay from "./work-order-details/WorkOrderChecklistDisplay.tsx";
import WorkOrderActivityHistory from "./work-order-details/WorkOrderActivityHistory.tsx";
import WorkOrderActionButtons from "./work-order-details/WorkOrderActionButtons.tsx";

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
  const [isCompletionActionsOpen, setIsCompletionActionsOpen] = useState(false);
  const [isOfflineSaved, setIsOfflineSaved] = useState(false);

  useEffect(() => {
    setCurrentOrder(workOrder);
    setIsOfflineSaved(!!getWorkOrderOffline(workOrder.id));
  }, [workOrder]);

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
    if (currentOrder.status === "Concluída" || currentOrder.status === "Cancelada" || currentOrder.status === "Em Verificação") {
      toast.error("Não é possível iniciar um serviço já concluído, cancelado ou em verificação.");
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
    saveWorkOrderOffline(updatedOrder);
    toast.success("Serviço iniciado com sucesso!");
  };

  const handleMarkForVerification = async () => {
    if (currentOrder.status !== "Em Andamento") {
      toast.info("A OS precisa estar 'Em Andamento' para ser marcada como 'Em Verificação'.");
      return;
    }
    if (!currentOrder.checklist) {
      toast.error("Por favor, preencha o checklist de execução antes de marcar para verificação.");
      setIsChecklistOpen(true);
      return;
    }

    const now = new Date().toISOString();
    const newActivity: ActivityLogEntry = {
      timestamp: now,
      action: "Serviço Marcado para Verificação",
      details: `Serviço concluído pelo técnico, aguardando verificação e assinatura do cliente.`,
    };

    const updatedOrder: WorkOrder = {
      ...currentOrder,
      status: "Em Verificação",
      activityHistory: [...currentOrder.activityHistory, newActivity],
    };
    setCurrentOrder(updatedOrder);
    onUpdateWorkOrder(updatedOrder);
    saveWorkOrderOffline(updatedOrder);
    toast.success("OS marcada como 'Em Verificação'.");
  };

  const handleEndService = async () => {
    if (currentOrder.status !== "Em Andamento" && currentOrder.status !== "Em Verificação") {
      toast.info("O serviço não está em andamento ou em verificação para ser finalizado.");
      return;
    }
    if (currentOrder.status === "Em Andamento" && !currentOrder.checklist) {
      toast.error("Por favor, preencha o checklist de execução antes de finalizar o serviço.");
      setIsChecklistOpen(true);
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
    saveWorkOrderOffline(updatedOrder);
    toast.success("Serviço finalizado com sucesso!");
    setIsCompletionActionsOpen(true);
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
    saveWorkOrderOffline(updatedOrder);
    toast.info("Ordem de Serviço cancelada.");
  };

  const handleSaveChecklist = (checklistData: WorkOrderChecklist) => {
    const updatedOrder: WorkOrder = {
      ...currentOrder,
      checklist: checklistData,
    };
    setCurrentOrder(updatedOrder);
    onUpdateWorkOrder(updatedOrder);
    saveWorkOrderOffline(updatedOrder);
    toast.success("Checklist salvo na Ordem de Serviço.");
  };

  const handleToggleOffline = () => {
    if (isOfflineSaved) {
      removeWorkOrderOffline(currentOrder.id);
      setIsOfflineSaved(false);
    } else {
      saveWorkOrderOffline(currentOrder);
      setIsOfflineSaved(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <WorkOrderDetailsHeader workOrder={currentOrder} />
        </DialogHeader>

        <ScrollArea className="flex-1 p-4 -mx-4">
          <div className="grid gap-4 py-4 px-4">
            <WorkOrderMainDetails workOrder={currentOrder} />
            <WorkOrderTimesAndLocations workOrder={currentOrder} />
            <WorkOrderChecklistDisplay
              workOrder={currentOrder}
              onOpenChecklist={() => setIsChecklistOpen(true)}
              isChecklistDisabled={currentOrder.status === "Concluída" || currentOrder.status === "Cancelada"}
            />
            <WorkOrderActivityHistory workOrder={currentOrder} />
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4">
          <WorkOrderActionButtons
            workOrder={currentOrder}
            onStartService={handleStartService}
            onMarkForVerification={handleMarkForVerification}
            onEndService={handleEndService}
            onCancelService={handleCancelService}
            onToggleOffline={handleToggleOffline}
            onClose={onClose}
            isOfflineSaved={isOfflineSaved}
          />
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

      {isCompletionActionsOpen && (
        <WorkOrderCompletionActionsDialog
          isOpen={isCompletionActionsOpen}
          onClose={() => setIsCompletionActionsOpen(false)}
          workOrder={currentOrder}
        />
      )}
    </Dialog>
  );
};

export default WorkOrderDetailsDialog;