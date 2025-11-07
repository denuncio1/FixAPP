"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkRequest, ActivityLogEntry, ChecklistMedia } from "@/types/work-order";
import { cn } from "@/lib/utils";
import { FileText, History, QrCode, Image as ImageIcon, Video, CheckCircle, AlertTriangle, Ban, Wrench } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as QrCodeModule from "qrcode.react"; // Corrigido: Importação de namespace

interface WorkRequestDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workRequest: WorkRequest;
  mockAssets: { id: string; name: string }[]; // Para exibir o nome do ativo
}

const WorkRequestDetailsDialog: React.FC<WorkRequestDetailsDialogProps> = ({
  isOpen,
  onClose,
  workRequest,
  mockAssets,
}) => {
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const getStatusBadgeClass = (status: WorkRequest['status']) => {
    switch (status) {
      case "Aberto":
        return "bg-blue-100 text-blue-800";
      case "Em Análise":
        return "bg-yellow-100 text-yellow-800";
      case "OS Gerada":
        return "bg-green-100 text-green-800";
      case "Rejeitada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: WorkRequest['status']) => {
    switch (status) {
      case "Aberto":
        return <FileText className="h-4 w-4 mr-1" />;
      case "Em Análise":
        return <AlertTriangle className="h-4 w-4 mr-1" />;
      case "OS Gerada":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "Rejeitada":
        return <Ban className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const getAssetName = (assetId?: string) => {
    if (!assetId) return "N/A";
    return mockAssets.find(asset => asset.id === assetId)?.name || assetId;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Detalhes da Solicitação <Badge>{workRequest.id}</Badge>
          </DialogTitle>
          <DialogDescription>
            Informações completas e histórico da solicitação de trabalho.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4 -mx-4">
          <div className="grid gap-4 py-4 px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="text-lg font-semibold">Solicitação de {getAssetName(workRequest.assetId)}</h3>
              <Badge className={cn("px-2 py-1 text-sm font-medium flex items-center", getStatusBadgeClass(workRequest.status))}>
                {getStatusIcon(workRequest.status)} {workRequest.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{workRequest.description}</p>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-medium">Criado por:</span> {workRequest.createdBy}</p>
                <p><span className="font-medium">Data de Criação:</span> {formatDateTime(workRequest.createdAt)}</p>
              </div>
              <div>
                <p><span className="font-medium">Ativo Relacionado:</span> {getAssetName(workRequest.assetId)}</p>
                {workRequest.generatedWorkOrderId && (
                  <p><span className="font-medium">OS Gerada:</span> {workRequest.generatedWorkOrderId}</p>
                )}
              </div>
            </div>

            {workRequest.assetId && (
              <>
                <Separator />
                <div>
                  <h4 className="text-md font-semibold mb-2 flex items-center gap-2">
                    <QrCode className="h-4 w-4" /> QR Code do Ativo
                  </h4>
                  <div className="flex justify-center">
                    <QrCodeModule.default value={workRequest.assetId} size={128} level="L" />
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    Escaneie para acessar informações do ativo.
                  </p>
                </div>
              </>
            )}

            {workRequest.attachments && workRequest.attachments.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" /> Anexos
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {workRequest.attachments.map((media, index) => (
                      <div key={index} className="relative">
                        {media.type === 'image' ? (
                          <img src={media.url} alt={media.filename} className="h-24 w-full object-cover rounded-md border" />
                        ) : (
                          <video src={media.url} controls className="h-24 w-full object-cover rounded-md border" />
                        )}
                        <span className="absolute bottom-1 left-1 text-xs text-white bg-black/50 px-1 rounded">
                          {media.filename}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            <h4 className="text-md font-semibold flex items-center gap-2"><History className="h-4 w-4" /> Histórico de Atividades:</h4>
            <ul className="space-y-2 text-sm">
              {workRequest.activityLog.length > 0 ? (
                workRequest.activityLog.map((activity, index) => (
                  <li key={index} className="border-l-2 pl-3">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-muted-foreground text-xs">{formatDateTime(activity.timestamp)}</p>
                    {activity.details && <p className="text-muted-foreground text-xs">{activity.details}</p>}
                  </li>
                ))
              ) : (
                <p className="text-muted-foreground">Nenhuma atividade registrada.</p>
              )}
            </ul>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          {workRequest.status !== "OS Gerada" && workRequest.status !== "Rejeitada" && (
            <Button>
              <Wrench className="h-4 w-4 mr-2" /> Gerar OS
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkRequestDetailsDialog;