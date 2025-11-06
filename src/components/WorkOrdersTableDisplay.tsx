"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wrench } from "lucide-react";

interface WorkOrder {
  id: string;
  client: string;
  address: string;
  type: string;
  scheduledTime: string;
  lat: number;
  lng: number;
  requiredSkill: string;
}

interface WorkOrdersTableDisplayProps {
  mockWorkOrders: WorkOrder[];
  selectedSkillFilter: string | null;
}

const WorkOrdersTableDisplay: React.FC<WorkOrdersTableDisplayProps> = ({
  mockWorkOrders,
  selectedSkillFilter,
}) => {
  const filteredWorkOrders = mockWorkOrders.filter(
    (order) => !selectedSkillFilter || order.requiredSkill === selectedSkillFilter
  );

  return (
    <Card className="lg:col-span-1 xl:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" /> Ordens de Serviço do Dia (Filtradas)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>OS Nº</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Tipo de Serviço</TableHead>
              <TableHead>Habilidade</TableHead>
              <TableHead>Horário Previsto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.client}</TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>{order.type}</TableCell>
                <TableCell>{order.requiredSkill}</TableCell>
                <TableCell>{order.scheduledTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WorkOrdersTableDisplay;