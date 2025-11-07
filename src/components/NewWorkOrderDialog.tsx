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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { WorkOrder } from "@/types/work-order"; // Importação corrigida

interface NewWorkOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newOrder: WorkOrder) => void;
}

const NewWorkOrderDialog: React.FC<NewWorkOrderDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [client, setClient] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technician, setTechnician] = useState("");
  const [priority, setPriority] = useState<"Baixa" | "Média" | "Crítica">(
    "Média",
  );
  const [classification, setClassification] = useState<"Preventiva" | "Corretiva" | "Preditiva" | "Emergencial">(
    "Corretiva", // Valor padrão
  );
  const [tagsInput, setTagsInput] = useState(""); // Novo estado para input de tags

  const handleSubmit = () => {
    if (!client || !title || !description) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const newOrder: WorkOrder = {
      id: `#OS${Math.floor(Math.random() * 10000)}`, // ID temporário
      status: "Pendente",
      client,
      title,
      description,
      technician: technician || "N/A",
      date: new Date().toLocaleDateString("pt-BR"),
      priority,
      classification, // Adicionado a classificação
      daysAgo: 0,
      tags: tagsInput.split(",").map(tag => tag.trim()).filter(tag => tag !== ""), // Processar tags
      activityHistory: [{
        timestamp: new Date().toISOString(),
        action: "OS Criada",
        details: `Ordem de serviço criada por ${client}`,
      }],
    };
    onSave(newOrder);
    onClose();
    // Limpar formulário
    setClient("");
    setTitle("");
    setDescription("");
    setTechnician("");
    setPriority("Média");
    setClassification("Corretiva"); // Resetar classificação
    setTagsInput("");
    toast.success("Nova Ordem de Serviço criada com sucesso!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Ordem de Serviço</DialogTitle>
          <DialogDescription>
            Preencha os detalhes para criar uma nova ordem de serviço.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">
              Cliente
            </Label>
            <Input
              id="client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Título
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="technician" className="text-right">
              Técnico
            </Label>
            <Input
              id="technician"
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Prioridade
            </Label>
            <Select
              value={priority}
              onValueChange={(value: "Baixa" | "Média" | "Crítica") =>
                setPriority(value)
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baixa">Baixa</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Crítica">Crítica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="classification" className="text-right">
              Classificação
            </Label>
            <Select
              value={classification}
              onValueChange={(value: "Preventiva" | "Corretiva" | "Preditiva" | "Emergencial") =>
                setClassification(value)
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione a classificação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Preventiva">Preventiva</SelectItem>
                <SelectItem value="Corretiva">Corretiva</SelectItem>
                <SelectItem value="Preditiva">Preditiva</SelectItem>
                <SelectItem value="Emergencial">Emergencial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input
              id="tags"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="col-span-3"
              placeholder="Ex: elétrica, hidráulica, urgente"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Criar OS</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewWorkOrderDialog;