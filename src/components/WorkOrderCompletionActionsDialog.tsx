"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, FileText, BellRing, CheckCircle } from "lucide-react";
import { WorkOrder } from "@/types/work-order";

interface WorkOrderCompletionActionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: WorkOrder;
}

const WorkOrderCompletionActionsDialog: React.FC<WorkOrderCompletionActionsDialogProps> = ({
  isOpen,
  onClose,
  workOrder,
}) => {
  const [sendEmail, setSendEmail] = useState(false);
  const [sendReport, setSendReport] = useState(false);

  const handleConfirmActions = () => {
    if (sendEmail) {
      toast.info(`E-mail de conclusão da OS ${workOrder.id} enviado para o responsável.`);
      // Lógica real para enviar e-mail aqui
    }
    if (sendReport) {
      toast.info(`Relatório da OS ${workOrder.id} gerado e enviado.`);
      // Lógica real para gerar e enviar relatório aqui
    }
    if (!sendEmail && !sendReport) {
      toast.info("Nenhuma ação selecionada para a OS concluída.");
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-blue-500" /> OS {workOrder.id} foi concluída!
          </DialogTitle>
          <DialogDescription>
            Selecione as ações adicionais para a Ordem de Serviço concluída.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="send-email"
              checked={sendEmail}
              onCheckedChange={(checked) => setSendEmail(!!checked)}
            />
            <Label
              htmlFor="send-email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
            >
              <Mail className="h-4 w-4" /> Enviar e-mail para o responsável
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="send-report"
              checked={sendReport}
              onCheckedChange={(checked) => setSendReport(!!checked)}
            />
            <Label
              htmlFor="send-report"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
            >
              <FileText className="h-4 w-4" /> Enviar relatório-OS-{workOrder.id}.pdf
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmActions}>
            <CheckCircle className="h-4 w-4 mr-2" /> Confirmar Ações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkOrderCompletionActionsDialog;