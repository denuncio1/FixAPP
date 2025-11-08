"use client";

import React from "react";
import { WorkOrder } from "@/types/work-order";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ListChecks, Camera, Video } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WorkOrderChecklistDisplayProps {
  workOrder: WorkOrder;
  onOpenChecklist: () => void;
  isChecklistDisabled: boolean;
}

const WorkOrderChecklistDisplay: React.FC<WorkOrderChecklistDisplayProps> = ({
  workOrder,
  onOpenChecklist,
  isChecklistDisabled,
}) => {
  const formatDateTime = (isoString?: string) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <>
      <Separator />
      <div>
        <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
          <ListChecks className="h-4 w-4" /> Checklist de Execução
        </h4>
        {workOrder.checklist ? (
          <div className="space-y-3">
            <p className="text-sm">
              <span className="font-medium">Concluído por:</span> {workOrder.checklist.signatureName} em{" "}
              {formatDateTime(workOrder.checklist.signatureDate)}
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {workOrder.checklist.items.map((item) => (
                <li key={item.id} className={item.completed ? "line-through text-green-600" : "text-red-600"}>
                  {item.description} {item.completed ? "(Concluído)" : "(Pendente)"}
                </li>
              ))}
            </ul>
            {workOrder.checklist.photos && workOrder.checklist.photos.length > 0 && (
              <>
                <p className="font-medium mt-4">Fotos:</p>
                <div className="grid grid-cols-3 gap-2">
                  {workOrder.checklist.photos.map((media) => (
                    <img key={media.url} src={media.url} alt={media.filename} className="h-20 w-full object-cover rounded-md border" />
                  ))}
                </div>
              </>
            )}
            {workOrder.checklist.videos && workOrder.checklist.videos.length > 0 && (
              <>
                <p className="font-medium mt-4">Vídeos:</p>
                <div className="grid grid-cols-3 gap-2">
                  {workOrder.checklist.videos.map((media) => (
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
          onClick={onOpenChecklist}
          disabled={isChecklistDisabled}
        >
          <ListChecks className="h-4 w-4 mr-2" /> {workOrder.checklist ? "Ver/Editar Checklist" : "Preencher Checklist"}
        </Button>
      </div>
    </>
  );
};

export default WorkOrderChecklistDisplay;