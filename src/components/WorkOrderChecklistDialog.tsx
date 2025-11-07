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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { WorkOrder } from "@/types/work-order";
import { Wrench } from "lucide-react";

interface WorkOrderChecklistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newOrder: WorkOrder) => void;
}

const WorkOrderChecklistDialog: React.FC<WorkOrderChecklistDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [issueMachineNotStarting, setIssueMachineNotStarting] = useState(false);
  const [issueLeakage, setIssueLeakage] = useState(false);
  const [issueStrangeNoise, setIssueStrangeNoise] = useState(false);
  const [issueOverheating, setIssueOverheating] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleSubmit = () => {
    const selectedIssues: string[] = [];
    let priority: WorkOrder["priority"] = "Baixa";
    let title = "OS Gerada por Checklist";
    let description = "Ordem de serviço gerada automaticamente com base no checklist:\n";

    if (issueMachineNotStarting) {
      selectedIssues.push("Máquina não liga");
      priority = "Crítica";
    }
    if (issueLeakage) {
      selectedIssues.push("Vazamento detectado");
      if (priority !== "Crítica") priority = "Média";
    }
    if (issueStrangeNoise) {
      selectedIssues.push("Ruído estranho no equipamento");
      if (priority !== "Crítica" && priority !== "Média") priority = "Média";
    }
    if (issueOverheating) {
      selectedIssues.push("Superaquecimento");
      priority = "Crítica";
    }

    if (selectedIssues.length === 0 && !additionalNotes) {
      toast.error("Por favor, selecione pelo menos um problema ou adicione notas.");
      return;
    }

    description += selectedIssues.map((issue) => `- ${issue}`).join("\n");
    if (additionalNotes) {
      description += `\n\nNotas Adicionais:\n${additionalNotes}`;
    }

    if (selectedIssues.length > 0) {
      title = `OS: ${selectedIssues[0]}${selectedIssues.length > 1 ? ` e outros (${selectedIssues.length - 1})` : ''}`;
    } else {
      title = "OS: Problema Geral (Checklist)";
    }


    const newOrder: WorkOrder = {
      id: `#OS${Math.floor(Math.random() * 10000)}`,
      status: "Pendente",
      client: "Cliente Interno (Checklist)", // Pode ser ajustado para selecionar um cliente
      title,
      description,
      technician: "N/A",
      date: new Date().toLocaleDateString("pt-BR"),
      priority,
      daysAgo: 0,
      tags: ["checklist", "automática", ...selectedIssues.map(issue => issue.toLowerCase().replace(/\s/g, '-'))],
      activityHistory: [{
        timestamp: new Date().toISOString(),
        action: "OS Criada por Checklist",
        details: "Ordem de serviço gerada via formulário de checklist.",
      }],
    };

    onSave(newOrder);
    onClose();
    // Resetar estados
    setIssueMachineNotStarting(false);
    setIssueLeakage(false);
    setIssueStrangeNoise(false);
    setIssueOverheating(false);
    setAdditionalNotes("");
    toast.success("Ordem de Serviço gerada por checklist com sucesso!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" /> Gerar OS por Checklist
          </DialogTitle>
          <DialogDescription>
            Marque os problemas identificados para gerar uma Ordem de Serviço.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">Problemas Comuns:</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="issue-machine-not-starting"
                checked={issueMachineNotStarting}
                onCheckedChange={(checked) => setIssueMachineNotStarting(!!checked)}
              />
              <label
                htmlFor="issue-machine-not-starting"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Máquina não liga / Falha de inicialização
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="issue-leakage"
                checked={issueLeakage}
                onCheckedChange={(checked) => setIssueLeakage(!!checked)}
              />
              <label
                htmlFor="issue-leakage"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Vazamento detectado
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="issue-strange-noise"
                checked={issueStrangeNoise}
                onCheckedChange={(checked) => setIssueStrangeNoise(!!checked)}
              />
              <label
                htmlFor="issue-strange-noise"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Ruído estranho no equipamento
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="issue-overheating"
                checked={issueOverheating}
                onCheckedChange={(checked) => setIssueOverheating(!!checked)}
              />
              <label
                htmlFor="issue-overheating"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Superaquecimento
              </label>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="additional-notes">Notas Adicionais</Label>
            <Textarea
              id="additional-notes"
              placeholder="Descreva outros problemas ou observações..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            <Wrench className="h-4 w-4 mr-2" /> Gerar OS
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkOrderChecklistDialog;