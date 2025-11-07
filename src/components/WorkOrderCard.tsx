"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { WorkOrder } from "@/types/work-order";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Package, Clock } from "lucide-react"; // Importar ícones

interface WorkOrderCardProps extends WorkOrder {
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
  classification,
  daysAgo,
  tags,
  deadlineDate,
  assetName, // Novo campo
  estimatedDuration, // Novo campo
  onClick,
}) => {
  const formattedDeadline = deadlineDate
    ? format(new Date(deadlineDate), "dd/MM/yyyy", { locale: ptBR })
    : "N/A";

  const headerClasses = cn(
    "pb-2",
    status === "Pendente" && "bg-yellow-200", // Amarelo mais forte
    status === "Em Andamento" && "bg-blue-100", // Azul para em andamento
    status === "Em Verificação" && "bg-blue-200", // Azul para em verificação
    status === "Concluída" && "bg-emerald-700 text-white", // Verde escuro com texto branco
    status === "Cancelada" && "bg-gray-300",
    status === "Crítica" && "bg-red-200", // Vermelho mais forte
  );

  const titleClasses = cn(
    "text-lg font-semibold",
    status === "Concluída" && "text-white",
  );

  const clientTextClasses = cn(
    "text-sm",
    status === "Concluída" ? "text-white/80" : "text-muted-foreground",
  );

  return (
    <Card className="flex flex-col h-full cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className={headerClasses}>
        <div className="flex items-center justify-between">
          <CardTitle className={titleClasses}>{id}</CardTitle>
          <Badge
            className={cn(
              "px-2 py-1 text-xs font-medium",
              status === "Pendente" && "bg-yellow-500 text-white hover:bg-yellow-500/80", // Amarelo vibrante
              status === "Em Andamento" && "bg-blue-500 text-white hover:bg-blue-500/80", // Azul vibrante
              status === "Em Verificação" && "bg-blue-500 text-white hover:bg-blue-500/80", // Azul vibrante para verificação
              status === "Concluída" && "bg-green-600 text-white hover:bg-green-600/80", // Verde vibrante
              status === "Crítica" && "bg-red-600 text-white hover:bg-red-600/80", // Vermelho vibrante
              status === "Cancelada" && "bg-gray-500 text-white hover:bg-gray-500/80", // Cinza mais escuro
            )}
          >
            {status}
          </Badge>
        </div>
        <p className={clientTextClasses}>{client}</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-md font-medium mb-1">{title}</h3>
          {assetName && (
            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
              <Package className="h-3 w-3" /> <span className="font-medium">Ativo:</span> {assetName}
            </p>
          )}
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
            <p>
              <span className="font-medium">Prazo:</span> {formattedDeadline}
            </p>
            {estimatedDuration && (
              <p className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> <span className="font-medium">Estimativa:</span> {estimatedDuration}
              </p>
            )}
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
                priority === "Alta" && "bg-purple-100 text-purple-800 hover:bg-purple-100/80",
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