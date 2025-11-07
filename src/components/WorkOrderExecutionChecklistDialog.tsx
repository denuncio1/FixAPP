"use client";

import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  WorkOrderChecklist,
  ChecklistItem,
  ChecklistMedia,
  WorkOrder,
} from "@/types/work-order";
import { ListChecks, Camera, Video, Signature, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WorkOrderExecutionChecklistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: WorkOrder;
  onSaveChecklist: (checklist: WorkOrderChecklist) => void;
}

// Mock de itens de checklist
const initialChecklistItems: ChecklistItem[] = [
  { id: "item1", description: "Verificação de segurança do equipamento", completed: false },
  { id: "item2", description: "Limpeza e lubrificação de componentes", completed: false },
  { id: "item3", description: "Teste de funcionalidade pós-manutenção", completed: false },
  { id: "item4", description: "Ajuste de parâmetros operacionais", completed: false },
  { id: "item5", description: "Descarte correto de resíduos", completed: false },
];

const WorkOrderExecutionChecklistDialog: React.FC<WorkOrderExecutionChecklistDialogProps> = ({
  isOpen,
  onClose,
  workOrder,
  onSaveChecklist,
}) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(
    workOrder.checklist?.items || initialChecklistItems,
  );
  const [photos, setPhotos] = useState<ChecklistMedia[]>(workOrder.checklist?.photos || []);
  const [videos, setVideos] = useState<ChecklistMedia[]>(workOrder.checklist?.videos || []);
  const [signatureName, setSignatureName] = useState(workOrder.checklist?.signatureName || "");
  const [notes, setNotes] = useState(""); // Notas gerais do checklist

  useEffect(() => {
    if (isOpen) {
      // Resetar ou carregar dados existentes ao abrir
      setChecklistItems(workOrder.checklist?.items || initialChecklistItems);
      setPhotos(workOrder.checklist?.photos || []);
      setVideos(workOrder.checklist?.videos || []);
      setSignatureName(workOrder.checklist?.signatureName || "");
      setNotes(""); // Resetar notas gerais ao abrir
    }
  }, [isOpen, workOrder]);

  const handleItemChange = (id: string, completed: boolean) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed } : item)),
    );
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newPhotos: ChecklistMedia[] = Array.from(event.target.files).map((file) => ({
        type: "image",
        url: URL.createObjectURL(file),
        filename: file.name,
      }));
      setPhotos((prev) => [...prev, ...newPhotos]);
      toast.success(`${newPhotos.length} foto(s) adicionada(s).`);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newVideos: ChecklistMedia[] = Array.from(event.target.files).map((file) => ({
        type: "video",
        url: URL.createObjectURL(file),
        filename: file.name,
      }));
      setVideos((prev) => [...prev, ...newVideos]);
      toast.success(`${newVideos.length} vídeo(s) adicionado(s).`);
    }
  };

  const handleRemoveMedia = (urlToRemove: string) => {
    setPhotos((prev) => prev.filter((media) => media.url !== urlToRemove));
    setVideos((prev) => prev.filter((media) => media.url !== urlToRemove));
    URL.revokeObjectURL(urlToRemove); // Libera a URL do objeto
    toast.info("Mídia removida.");
  };

  const handleSubmitChecklist = () => {
    if (checklistItems.some((item) => !item.completed)) {
      toast.error("Todos os itens do checklist devem ser concluídos.");
      return;
    }
    if (!signatureName) {
      toast.error("Por favor, insira seu nome para a assinatura digital.");
      return;
    }

    const completedChecklist: WorkOrderChecklist = {
      items: checklistItems,
      photos: photos.length > 0 ? photos : undefined,
      videos: videos.length > 0 ? videos : undefined,
      signatureName,
      signatureDate: new Date().toISOString(),
      completedByTechnicianId: workOrder.technician, // Usar o nome do técnico como ID temporário
      completedByTechnicianName: workOrder.technician,
    };

    onSaveChecklist(completedChecklist);
    onClose();
    toast.success("Checklist de execução salvo com sucesso!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5" /> Checklist de Execução - OS {workOrder.id}
          </DialogTitle>
          <DialogDescription>
            Preencha o checklist, adicione mídias e assine para finalizar a execução da OS.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4 -mx-4">
          <div className="grid gap-6 py-4 px-4">
            {/* Itens do Checklist */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <ListChecks className="h-4 w-4" /> Itens do Checklist
              </h3>
              <div className="space-y-3">
                {checklistItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={item.completed}
                      onCheckedChange={(checked) => handleItemChange(item.id, !!checked)}
                    />
                    <label
                      htmlFor={`item-${item.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.description}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload de Fotos */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Camera className="h-4 w-4" /> Fotos
              </h3>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="mb-3"
              />
              <div className="grid grid-cols-3 gap-3">
                {photos.map((media) => (
                  <div key={media.url} className="relative group">
                    <img
                      src={media.url}
                      alt={media.filename}
                      className="h-24 w-full object-cover rounded-md border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveMedia(media.url)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload de Vídeos */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Video className="h-4 w-4" /> Vídeos
              </h3>
              <Input
                id="video-upload"
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoUpload}
                className="mb-3"
              />
              <div className="grid grid-cols-3 gap-3">
                {videos.map((media) => (
                  <div key={media.url} className="relative group">
                    <video
                      src={media.url}
                      controls
                      className="h-24 w-full object-cover rounded-md border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveMedia(media.url)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Assinatura Digital */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Signature className="h-4 w-4" /> Assinatura Digital
              </h3>
              <div className="grid gap-2">
                <Label htmlFor="signature-name">Nome do Técnico</Label>
                <Input
                  id="signature-name"
                  placeholder="Nome Completo do Técnico"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Ao clicar em "Concluir Checklist", você estará assinando digitalmente este documento.
                </p>
              </div>
            </div>

            {/* Notas Gerais (Opcional) */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Notas Gerais</h3>
              <Textarea
                placeholder="Adicione quaisquer notas adicionais sobre a execução do serviço..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmitChecklist}>
            <ListChecks className="h-4 w-4 mr-2" /> Concluir Checklist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkOrderExecutionChecklistDialog;