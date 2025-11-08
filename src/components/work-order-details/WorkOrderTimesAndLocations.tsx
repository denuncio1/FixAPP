"use client";

import React from "react";
import { WorkOrder, LocationData } from "@/types/work-order";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WorkOrderTimesAndLocationsProps {
  workOrder: WorkOrder;
}

const WorkOrderTimesAndLocations: React.FC<WorkOrderTimesAndLocationsProps> = ({ workOrder }) => {
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
      <h4 className="text-md font-semibold flex items-center gap-2"><Clock className="h-4 w-4" /> Tempos e Localizações:</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p><span className="font-medium">Início do Serviço:</span> {formatDateTime(workOrder.startTime)}</p>
          {workOrder.startLocation && (
            <p className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" /> {workOrder.startLocation.address || `Lat: ${workOrder.startLocation.lat.toFixed(4)}, Lng: ${workOrder.startLocation.lng.toFixed(4)}`}
            </p>
          )}
        </div>
        <div>
          <p><span className="font-medium">Fim do Serviço:</span> {formatDateTime(workOrder.endTime)}</p>
          {workOrder.endLocation && (
            <p className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" /> {workOrder.endLocation.address || `Lat: ${workOrder.endLocation.lat.toFixed(4)}, Lng: ${workOrder.endLocation.lng.toFixed(4)}`}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default WorkOrderTimesAndLocations;