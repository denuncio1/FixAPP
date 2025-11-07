"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WorkOrder } from "@/types/work-order"; // Importação corrigida

interface WorkOrderCardProps extends WorkOrder { // Estendendo WorkOrder corretamente
  onClick: () => void;
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
  classification, // Adicionado classificação
  daysAgo,
  tags,
  onClick,
}) => {
  return (
    <Card className="flex flex-col h-full cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{id}</CardTitle>
          <Badge
            className={cn(
              "px-2 py-1 text-xs font-medium",
              status === "Pendente" && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
              status === "Em Andamento" && "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
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
            <p>
              <span className="font-medium">Classificação:</span> {classification}
            </p>
          </div>
        </div>
        <div className="mt-4">
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <Badge
              className={cn(
                "px-2 py-1 text-xs font-medium",
                priority === "Baixa" && "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
                priority === "Média" && "bg-orange-100 text-orange-800 hover:bg-orange-100/80",
                priority === "Crítica" && "bg-red-100 text-red-800 hover:bg-red-100/80",
              )}
            >
              Prioridade: {priority}
            </Badge>
            <p className="text-xs text-muted-foreground">
              Criada há {daysAgo} dias
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkOrderCard;