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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { WorkOrder } from "@/types/work-order";
import { cn } from "@/lib/utils";

// Mock de técnicos para o Select
const mockTechnicians = [
  { id: "tech1", name: "Carlos Turibio" },
  { id: "tech2", name: "Nilson Denuncio" },
  { id: "tech3", name: "João Silva" },
  { id: "tech4", name: "Equipe de Emergência" },
];

interface NewWorkOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newOrder: WorkOrder) => void;
  initialData?: Partial<WorkOrder>; // NOVO: Adicionando a prop initialData
}

const NewWorkOrderDialog: React.FC<NewWorkOrderDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [client, setClient] = useState(initialData?.client || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [technician, setTechnician] = useState(initialData?.technician || "");
  const [priority, setPriority] = useState<"Baixa" | "Média" | "Crítica" | "Alta">(
    initialData?.priority || "Média",
  );
  const [classification, setClassification] = useState<"Preventiva" | "Corretiva" | "Preditiva" | "Emergencial">(
    initialData?.classification || "Corretiva",
  );
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(
    initialData?.deadlineDate ? new Date(initialData.deadlineDate) : undefined
  );
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(", ") || "");

  // Resetar estados quando o diálogo é aberto com novos dados iniciais
  React.useEffect(() => {
    if (isOpen) {
      setClient(initialData?.client || "");
      setTitle(initialData?.title || "");
      setDescription(initialData?.description || "");
      setTechnician(initialData?.technician || "");
      setPriority(initialData?.priority || "Média");
      setClassification(initialData?.classification || "Corretiva");
      setDeadlineDate(initialData?.deadlineDate ? new Date(initialData.deadlineDate) : undefined);
      setTagsInput(initialData?.tags?.join(", ") || "");
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    if (!client || !title || !description || !technician) {
      toast.error("Por favor, preencha todos os campos obrigatórios (Cliente, Título, Descrição, Técnico).");
      return;
    }

    const newOrder: WorkOrder = {
      id: `#OS${Math.floor(Math.random() * 10000)}`,
      status: "Pendente",
      client,
      title,
      description,
      technician: technician,
      date: new Date().toLocaleDateString("pt-BR"),
      priority,
      classification,
      daysAgo: 0,
      tags: tagsInput.split(",").map(tag => tag.trim()).filter(tag => tag !== ""),
      deadlineDate: deadlineDate ? deadlineDate.toISOString() : undefined, // Salva o prazo
      activityHistory: [{
        timestamp: new Date().toISOString(),
        action: "OS Criada",
        details: `Ordem de serviço criada por ${client}`,
      }],
      assetId: initialData?.assetId, // Manter assetId se veio do initialData
      assetName: initialData?.assetName, // Manter assetName se veio do initialData
    };
    onSave(newOrder);
    onClose();
    // Limpar formulário
    setClient("");
    setTitle("");
    setDescription("");
    setTechnician("");
    setPriority("Média");
    setClassification("Corretiva");
    setDeadlineDate(undefined);
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
            <Select
              value={technician}
              onValueChange={setTechnician}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione o técnico" />
              </SelectTrigger>
              <SelectContent>
                {mockTechnicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.name}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Prioridade
            </Label>
            <Select
              value={priority}
              onValueChange={(value: "Baixa" | "Média" | "Crítica" | "Alta") =>
                setPriority(value)
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baixa">Baixa</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
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
            <Label htmlFor="deadlineDate" className="text-right">
              Prazo
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !deadlineDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadlineDate ? format(deadlineDate, "PPP", { locale: ptBR }) : <span>Selecione um prazo</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadlineDate}
                  onSelect={setDeadlineDate}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
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