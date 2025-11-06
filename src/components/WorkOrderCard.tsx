"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WorkOrderCardProps {
  id: string;
  status: "Pendente" | "Concluída" | "Crítica";
  client: string;
  title: string;
  description: string;
  technician: string;
  date: string;
  priority: "Baixa" | "Média" | "Crítica";
  daysAgo: number;
}

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({
  id,
  status,
  client,
  title,
  description,
  technician,
  date,
  priority,
  daysAgo,
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Pendente":
        return "yellow"; // Tailwind yellow-500
      case "Concluída":
        return "green"; // Tailwind green-500
      case "Crítica":
        return "red"; // Tailwind red-500
      default:
        return "default";
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "Baixa":
        return "blue";
      case "Média":
        return "blue";
      case "Crítica":
        return "red";
      default:
        return "default";
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{id}</CardTitle>
          <Badge
            className={cn(
              "px-2 py-1 text-xs font-medium",
              status === "Pendente" && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
              status === "Concluída" && "bg-green-100 text-green-800 hover:bg-green-100/80",
              status === "Crítica" && "bg-red-100 text-red-800 hover:bg-red-100/80",
            )}
          >
            {status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{client}</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-md font-medium mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
          <div className="text-sm">
            <p>
              <span className="font-medium">Técnico:</span>{" "}
              {technician || "N/A"}
            </p>
            <p>
              <span className="font-medium">Data:</span> {date}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Badge
            className={cn(
              "px-2 py-1 text-xs font-medium",
              priority === "Baixa" && "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
              priority === "Média" && "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
              priority === "Crítica" && "bg-red-100 text-red-800 hover:bg-red-100/80",
            )}
          >
            Prioridade: {priority}
          </Badge>
          <p className="text-xs text-muted-foreground">
            Criada há {daysAgo} dias
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkOrderCard;