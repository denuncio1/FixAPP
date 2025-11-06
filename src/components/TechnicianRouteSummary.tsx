"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";
import { WorkOrder } from "@/types/work-order"; // Importação corrigida

interface Technician {
  id: string;
  name: string;
  color: string;
  skills: string[];
  startLat: number;
  startLng: number;
}

interface TechnicianRouteSummaryProps {
  technician: Technician;
  summary: { totalTime: string; segmentTimes: string[] };
  assignedOrders: WorkOrder[];
}

const TechnicianRouteSummary: React.FC<TechnicianRouteSummaryProps> = ({
  technician,
  summary,
  assignedOrders,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" style={{ color: technician.color }} /> Deslocamento Previsto: {technician.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {assignedOrders && assignedOrders.length > 0 ? (
          <>
            <h3 className="font-semibold mb-2">Ordens Atribuídas:</h3>
            <ul className="list-disc pl-5 mb-4 text-sm text-muted-foreground">
              {assignedOrders.map((order) => (
                <li key={order.id}>
                  {order.id} - {order.type} ({order.client})
                </li>
              ))}
            </ul>
            <h3 className="font-semibold mb-2">Tempos de Viagem:</h3>
            <ul className="space-y-1 mb-2">
              {summary.segmentTimes.map((time, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {time}
                </li>
              ))}
            </ul>
            <p className="text-lg font-semibold mt-4">
              Tempo total estimado de deslocamento: {summary.totalTime}
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">
            Nenhuma ordem de serviço atribuída a {technician.name} com os filtros atuais.
          </p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          *Esta é uma simulação. A precisão depende da chave da API do Google Maps e da lógica de otimização.
        </p>
      </CardContent>
    </Card>
  );
};

export default TechnicianRouteSummary;