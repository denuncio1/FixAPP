"use client";

import React from "react";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { WorkOrder } from "@/types/work-order";
import { cn } from "@/lib/utils";
import { MapPin, Clock, Play, Square, History, Ban, ListChecks, Camera, Video, Signature, CheckCircle, AlertTriangle, SearchCheck, Package, Download } from "lucide-react";

interface WorkOrderDetailsHeaderProps {
  workOrder: WorkOrder;
}

const WorkOrderDetailsHeader: React.FC<WorkOrderDetailsHeaderProps> = ({ workOrder }) => {
  const getStatusIcon = (status: WorkOrder['status']) => {
    switch (status) {
      case "Pendente":
        return <Clock className="h-4 w-4 mr-1" />;
      case "Em Andamento":
        return <Play className="h-4 w-4 mr-1" />;
      case "Em Verificação":
        return <SearchCheck className="h-4 w-4 mr-1" />;
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
    <>
      <DialogTitle className="flex items-center gap-2">
        Detalhes da Ordem de Serviço <Badge>{workOrder.id}</Badge>
      </DialogTitle>
      <DialogDescription>
        Informações completas e histórico da ordem de serviço.
      </DialogDescription>
    </>
  );
};

export default WorkOrderDetailsHeader;