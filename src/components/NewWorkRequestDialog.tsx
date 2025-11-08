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
import { Plus, QrCode, Image as ImageIcon, Video, X } from "lucide-react";
import { WorkRequest, ChecklistMedia } from "@/types/work-order";

// Mock Data para Ativos (para simular a seleção via QR Code)
const mockAssets = [
  { id: "asset1", name: "Máquina de Produção X" },
  { id: "asset2", name: "Compressor Principal" },
  { id: "asset3", name: "Painel Solar 01" },
  { id: "asset4", name: "Sistema HVAC-01" },
];

interface NewWorkRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newRequest: WorkRequest) => void;
  initialData?: Partial<WorkRequest>; // Para pré-preencher o formulário
}

const NewWorkRequestDialog: React.FC<NewWorkRequestDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [description, setDescription] = useState(initialData?.description || "");
  const [assetId, setAssetId] = useState<string | undefined>(initialData?.assetId);
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setDescription(initialData?.description || "");
      setAssetId(initialData?.assetId);
      setPhotos([]);
      setVideos([]);
      setPhotoPreviewUrls([]);
      setVideoPreviewUrls([]);
      // Se houver attachments iniciais, carregar previews
      if (initialData?.attachments) {
        const initialPhotos = initialData.attachments.filter(att => att.type === 'image');
        const initialVideos = initialData.attachments.filter(att => att.type === 'video');
        setPhotoPreviewUrls(initialPhotos.map(att => att.url));
        setVideoPreviewUrls(initialVideos.map(att => att.url));
      }
    }
  }, [isOpen, initialData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      if (type === 'image') {
        setPhotos((prev) => [...prev, ...files]);
        setPhotoPreviewUrls((prev) => [...prev, ...files.map(file => URL.createObjectURL(file))]);
      } else {
        setVideos((prev) => [...prev, ...files]);
        setVideoPreviewUrls((prev) => [...prev, ...files.map(file => URL.createObjectURL(file))]);
      }
      toast.success(`${files.length} ${type === 'image' ? 'foto(s)' : 'vídeo(s)'} adicionada(s).`);
    }
  };

  const handleRemoveMedia = (urlToRemove: string, type: 'image' | 'video') => {
    if (type === 'image') {
      setPhotoPreviewUrls((prev) => prev.filter((url) => url !== urlToRemove));
      setPhotos((prev) => prev.filter((file) => URL.createObjectURL(file) !== urlToRemove));
    } else {
      setVideoPreviewUrls((prev) => prev.filter((url) => url !== urlToRemove));
      setVideos((prev) => prev.filter((file) => URL.createObjectURL(file) !== urlToRemove));
    }
    URL.revokeObjectURL(urlToRemove); // Libera a URL do objeto
    toast.info("Mídia removida.");
  };

  const handleSubmit = () => {
    if (!description) {
      toast.error("A descrição da solicitação é obrigatória.");
      return;
    }

    const asset = mockAssets.find(a => a.id === assetId);
    const newAttachments: ChecklistMedia[] = [
      ...photos.map(file => ({ type: 'image' as const, url: URL.createObjectURL(file), filename: file.name })),
      ...videos.map(file => ({ type: 'video' as const, url: URL.createObjectURL(file), filename: file.name })),
      ...(initialData?.attachments || []), // Manter attachments iniciais se houver
    ];

    const newRequest: WorkRequest = {
      id: `SR${Math.floor(Math.random() * 10000)}`,
      status: "Aberto",
      createdBy: "Usuário Atual (Mock)", // Em um app real, seria o usuário logado
      createdAt: new Date().toISOString(),
      description: description,
      assetId: assetId,
      assetName: asset?.name,
      attachments: newAttachments.length > 0 ? newAttachments : undefined,
      activityLog: [
        { timestamp: new Date().toISOString(), action: "Solicitação Aberta", details: "Nova solicitação de trabalho criada." },
      ],
      ...initialData, // Sobrescreve com dados iniciais, mas permite que os campos do formulário prevaleçam
    };

    onSave(newRequest);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" /> Nova Solicitação de Trabalho
          </DialogTitle>
          <DialogDescription>
            Preencha os detalhes para criar uma nova solicitação.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-y-auto pr-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição do Problema *</Label>
            <Textarea
              id="description"
              placeholder="Descreva o problema ou a necessidade de serviço..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="asset">Ativo Relacionado (Opcional)</Label>
            <Select value={assetId} onValueChange={setAssetId}>
              <SelectTrigger id="asset">
                <SelectValue placeholder="Selecione um ativo" />
              </SelectTrigger>
              <SelectContent>
                {mockAssets.map((asset) => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="photos">Anexar Fotos</Label>
            <Input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange(e, 'image')}
            />
            {photoPreviewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {photoPreviewUrls.map((url) => (
                  <div key={url} className="relative group">
                    <img src={url} alt="Preview" className="h-20 w-full object-cover rounded-md border" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveMedia(url, 'image')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="videos">Anexar Vídeos</Label>
            <Input
              id="videos"
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => handleFileChange(e, 'video')}
            />
            {videoPreviewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {videoPreviewUrls.map((url) => (
                  <div key={url} className="relative group">
                    <video src={url} controls className="h-20 w-full object-cover rounded-md border" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveMedia(url, 'video')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            <Plus className="h-4 w-4 mr-2" /> Criar Solicitação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewWorkRequestDialog;