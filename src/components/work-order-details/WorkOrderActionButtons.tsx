"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { WorkOrder } from "@/types/work-order";
import { Play, Square, Ban, SearchCheck, Download } from "lucide-react";

interface WorkOrderActionButtonsProps {
  workOrder: WorkOrder;
  onStartService: () => void;
  onMarkForVerification: () => void;
  onEndService: () => void;
  onCancelService: () => void;
  onToggleOffline: () => void;
  onClose: () => void;
  isOfflineSaved: boolean;
}

const WorkOrderActionButtons: React.FC<WorkOrderActionButtonsProps> = ({
  workOrder,
  onStartService,
  onMarkForVerification,
  onEndService,
  onCancelService,
  onToggleOffline,
  onClose,
  isOfflineSaved,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-2 pt-4">
      <div className="flex gap-2 w-full sm:w-auto mb-2 sm:mb-0 flex-wrap">
        <Button
          variant="outline"
          onClick={onStartService}
          disabled={workOrder.status === "Em Andamento" || workOrder.status === "Concluída" || workOrder.status === "Cancelada" || workOrder.status === "Em Verificação"}
          className="w-full sm:w-auto"
        >
          <Play className="h-4 w-4 mr-2" /> Iniciar Serviço
        </Button>
        <Button
          variant="secondary"
          onClick={onMarkForVerification}
          disabled={workOrder.status !== "Em Andamento" || !workOrder.checklist}
          className="w-full sm:w-auto"
        >
          <SearchCheck className="h-4 w-4 mr-2" /> Marcar como Em Verificação
        </Button>
        <Button
          variant="destructive"
          onClick={onEndService}
          disabled={workOrder.status !== "Em Andamento" && workOrder.status !== "Em Verificação"}
          className="w-full sm:w-auto"
        >
          <Square className="h-4 w-4 mr-2" /> Finalizar Serviço
        </Button>
        <Button
          variant="secondary"
          onClick={onCancelService}
          disabled={workOrder.status === "Concluída" || workOrder.status === "Cancelada"}
          className="w-full sm:w-auto"
        >
          <Ban className="h-4 w-4 mr-2" /> Cancelar Serviço
        </Button>
      </div>
      <Button onClick={onToggleOffline} className="w-full sm:w-auto mb-2 sm:mb-0">
        <Download className="h-4 w-4 mr-2" /> {isOfflineSaved ? "Remover Offline" : "Download Offline"}
      </Button>
      <Button onClick={onClose} className="w-full sm:w-auto">
        Fechar
      </Button>
    </div>
  );
};

export default WorkOrderActionButtons;