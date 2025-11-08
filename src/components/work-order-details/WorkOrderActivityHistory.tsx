"use client";

import React from "react";
import { WorkOrder } from "@/types/work-order";
import { Separator } from "@/components/ui/separator";
import { History, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WorkOrderActivityHistoryProps {
  workOrder: WorkOrder;
}

const WorkOrderActivityHistory: React.FC<WorkOrderActivityHistoryProps> = ({ workOrder }) => {
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
      <h4 className="text-md font-semibold flex items-center gap-2"><History className="h-4 w-4" /> Histórico de Atividades:</h4>
      <ul className="space-y-2 text-sm">
        {workOrder.activityHistory.length > 0 ? (
          workOrder.activityHistory.map((activity, index) => (
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
    </>
  );
};

export default WorkOrderActivityHistory;