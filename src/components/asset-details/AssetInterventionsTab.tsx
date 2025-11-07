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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from "lucide-react";
import { Asset, AssetActivityLogEntry } from "@/types/asset";
import { WorkOrder } from "@/types/work-order";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AssetInterventionsTabProps {
  asset: Asset;
  assetWorkOrders: WorkOrder[];
}

const AssetInterventionsTab: React.FC<AssetInterventionsTabProps> = ({ asset, assetWorkOrders }) => {
  const formatDateTime = (isoString?: string) => {
    if (!isoString) return "N/A";
    return format(new Date(isoString), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const formatDateOnly = (isoString?: string) => {
    if (!isoString) return "N/A";
    return format(new Date(isoString), "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" /> Histórico de Ordens de Serviço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID da OS</TableHead>
                <TableHead>Tipo de Tarefa</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Data de Conclusão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assetWorkOrders.length > 0 ? (
                assetWorkOrders.map((wo) => (
                  <TableRow key={wo.id}>
                    <TableCell className="font-medium">{wo.id}</TableCell>
                    <TableCell>{wo.classification}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{wo.description}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          wo.status === "Concluída"
                            ? "bg-green-100 text-green-800"
                            : wo.status === "Em Andamento"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {wo.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatDateOnly(wo.endTime || wo.date)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                    Nenhuma ordem de serviço encontrada para este ativo.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" /> Log de Atividades do Ativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] pr-4">
            <ul className="space-y-3">
              {asset.activityHistory.length > 0 ? (
                asset.activityHistory.map((activity, index) => (
                  <li key={index} className="border-l-2 pl-3">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-muted-foreground text-xs">{formatDateTime(activity.timestamp)}</p>
                    {activity.details && <p className="text-muted-foreground text-xs">{activity.details}</p>}
                  </li>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">Nenhuma atividade registrada para este ativo.</p>
              )}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetInterventionsTab;