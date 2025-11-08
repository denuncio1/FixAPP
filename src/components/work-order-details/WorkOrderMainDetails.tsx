"use client";

import React from "react";
import { WorkOrder } from "@/types/work-order";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Package, Clock as ClockIcon } from "lucide-react"; // Renomeado para evitar conflito
import { cn } from "@/lib/utils"; // NOVO: Importar cn

interface WorkOrderMainDetailsProps {
  workOrder: WorkOrder;
}

const WorkOrderMainDetails: React.FC<WorkOrderMainDetailsProps> = ({ workOrder }) => {
  const formatDateOnly = (isoString?: string) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-lg font-semibold">{workOrder.title}</h3>
        <Badge
          className={cn(
            "px-2 py-1 text-sm font-medium flex items-center",
            workOrder.status === "Pendente" && "bg-yellow-100 text-yellow-800",
            workOrder.status === "Em Andamento" && "bg-blue-100 text-blue-800",
            workOrder.status === "Em Verificação" && "bg-blue-200 text-blue-800",
            workOrder.status === "Concluída" && "bg-green-100 text-green-800",
            workOrder.status === "Crítica" && "bg-red-100 text-red-800",
            workOrder.status === "Cancelada" && "bg-gray-300 text-gray-800",
          )}
        >
          {workOrder.status}
        </Badge>
      </div>
      <p className="text-muted-foreground">{workOrder.description}</p>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p><span className="font-medium">Cliente:</span> {workOrder.client}</p>
          <p><span className="font-medium">Técnico:</span> {workOrder.technician || "N/A"}</p>
          <p><span className="font-medium">Data Criação:</span> {workOrder.date}</p>
        </div>
        <div>
          <p><span className="font-medium">Prioridade:</span> {workOrder.priority}</p>
          <p><span className="font-medium">Classificação:</span> {workOrder.classification}</p>
          <p><span className="font-medium">Prazo:</span> {formatDateOnly(workOrder.deadlineDate)}</p>
          <p><span className="font-medium">Criada há:</span> {workOrder.daysAgo} dias</p>
        </div>
      </div>

      {workOrder.assetName && (
        <>
          <Separator />
          <p className="text-sm flex items-center gap-1">
            <Package className="h-4 w-4" /> <span className="font-medium">Ativo Relacionado:</span> {workOrder.assetName}
          </p>
        </>
      )}

      {workOrder.estimatedDuration && (
        <p className="text-sm flex items-center gap-1">
          <ClockIcon className="h-4 w-4" /> <span className="font-medium">Duração Estimada:</span> {workOrder.estimatedDuration}
        </p>
      )}

      {workOrder.tags && workOrder.tags.length > 0 && (
        <>
          <Separator />
          <div>
            <p className="font-medium mb-1">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {workOrder.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default WorkOrderMainDetails;