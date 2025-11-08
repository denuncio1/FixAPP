"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PenTool, ListChecks, FileText, CalendarIcon, CheckCircle2, XCircle, History, Download, Upload, Signature, Camera, Video, MapPin, Wrench } from "lucide-react";
import { NrChecklistItem } from "@/types/nr-checklist";
import { ChecklistMedia, WorkRequest } from "@/types/work-order"; // Importar WorkRequest e ChecklistMedia

interface LocationData {
  lat: number;
  lng: number;
  timestamp: string;
  address?: string;
}

interface NRChecklistExecutionProps {
  selectedNr: string | null;
  getNrTitle: (nrNumber: string) => string;
  currentRunItems: NrChecklistItem[];
  handleItemComplianceChange: (id: string, compliant: boolean) => void;
  handleItemNotesChange: (id: string, notes: string) => void;
  runPhotos: ChecklistMedia[];
  handlePhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveMedia: (urlToRemove: string) => void;
  runVideos: ChecklistMedia[];
  handleVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  runNotes: string;
  setRunNotes: (notes: string) => void;
  signatureName: string;
  setSignatureName: (name: string) => void;
  currentLocation: LocationData | null;
  handleGetLocation: () => void;
  handleCompleteChecklist: () => void;
  handleGenerateWorkRequest: () => void;
}

const NRChecklistExecution: React.FC<NRChecklistExecutionProps> = ({
  selectedNr,
  getNrTitle,
  currentRunItems,
  handleItemComplianceChange,
  handleItemNotesChange,
  runPhotos,
  handlePhotoUpload,
  handleRemoveMedia,
  runVideos,
  handleVideoUpload,
  runNotes,
  setRunNotes,
  signatureName,
  setSignatureName,
  currentLocation,
  handleGetLocation,
  handleCompleteChecklist,
  handleGenerateWorkRequest,
}) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="h-5 w-5" /> Executar Checklist: {selectedNr ? getNrTitle(selectedNr) : "N/A"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedNr ? (
          <div className="grid gap-4">
            <div className="max-h-[300px] overflow-y-auto pr-4">
              {currentRunItems.length > 0 ? (
                currentRunItems.map((item) => (
                  <div key={item.id} className={cn("mb-4", item.is_header ? "font-semibold text-md mt-4" : "border-b pb-3")}>
                    <div className="flex items-center space-x-2 mb-2">
                      {!item.is_header && (
                        <>
                          <Checkbox
                            id={`item-${item.id}-compliant`}
                            checked={item.is_compliant === true}
                            onCheckedChange={(checked) => handleItemComplianceChange(item.id, !!checked)}
                          />
                          <Label htmlFor={`item-${item.id}-compliant`} className="text-sm font-medium leading-none">
                            {item.item_description}
                          </Label>
                          {item.is_compliant === false && <XCircle className="h-4 w-4 text-red-500 ml-2" />}
                          {item.is_compliant === true && <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />}
                        </>
                      )}
                      {item.is_header && <span className="text-base">{item.item_description}</span>}
                    </div>
                    {!item.is_header && item.guidance && (
                      <p className="text-xs text-muted-foreground ml-6 mb-2">
                        <span className="font-medium">Orientação:</span> {item.guidance}
                      </p>
                    )}
                    {!item.is_header && (
                      <Textarea
                        placeholder="Notas sobre este item..."
                        value={item.notes || ""}
                        onChange={(e) => handleItemNotesChange(item.id, e.target.value)}
                        className="ml-6 mt-1 text-sm"
                      />
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum item de checklist disponível para esta normativa.
                </p>
              )}
            </div>

            {/* Mídias */}
            <div className="grid gap-2 mt-4">
              <Label htmlFor="photo-upload" className="flex items-center gap-2">
                <Camera className="h-4 w-4" /> Fotos
              </Label>
              <Input id="photo-upload" type="file" accept="image/*" multiple onChange={handlePhotoUpload} />
              <div className="grid grid-cols-3 gap-2">
                {runPhotos.map((media) => (
                  <div key={media.url} className="relative group">
                    <img src={media.url} alt={media.filename} className="h-20 w-full object-cover rounded-md border" />
                    <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveMedia(media.url)}>
                      <XCircle className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="video-upload" className="flex items-center gap-2">
                <Video className="h-4 w-4" /> Vídeos
              </Label>
              <Input id="video-upload" type="file" accept="video/*" multiple onChange={handleVideoUpload} />
              <div className="grid grid-cols-3 gap-2">
                {runVideos.map((media) => (
                  <div key={media.url} className="relative group">
                    <video src={media.url} controls className="h-20 w-full object-cover rounded-md border" />
                    <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleRemoveMedia(media.url)}>
                      <XCircle className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notas Gerais */}
            <div className="grid gap-2">
              <Label htmlFor="run-notes">Notas Gerais</Label>
              <Textarea
                id="run-notes"
                placeholder="Observações adicionais sobre a execução do checklist..."
                value={runNotes}
                onChange={(e) => setRunNotes(e.target.value)}
              />
            </div>

            {/* Localização e Assinatura */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="signature-name" className="flex items-center gap-2">
                  <Signature className="h-4 w-4" /> Assinatura Digital
                </Label>
                <Input
                  id="signature-name"
                  placeholder="Seu Nome Completo"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location-info" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Localização
                </Label>
                <Button type="button" variant="outline" onClick={handleGetLocation}>
                  {currentLocation ? "Localização Obtida" : "Obter Localização Atual"}
                </Button>
                {currentLocation && (
                  <p className="text-xs text-muted-foreground break-words">
                    {currentLocation.address || `Lat: ${currentLocation.lat.toFixed(4)}, Lng: ${currentLocation.lng.toFixed(4)}`}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 w-full mt-4">
              <Button onClick={handleCompleteChecklist} className="flex-1">
                <ListChecks className="h-4 w-4 mr-2" /> Concluir Checklist
              </Button>
              <Button onClick={handleGenerateWorkRequest} className="flex-1" variant="secondary">
                <Wrench className="h-4 w-4 mr-2" /> Gerar Solicitação de Trabalho
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            Selecione uma normativa para iniciar a execução do checklist.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default NRChecklistExecution;