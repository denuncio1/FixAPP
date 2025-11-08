"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ListChecks, Download, Upload } from "lucide-react";
import { NormaRegulamentadora } from "@/types/nr-checklist";

interface NRChecklistSelectionProps {
  normas: NormaRegulamentadora[];
  selectedNr: string | null;
  setSelectedNr: (nrNumber: string | null) => void;
  getNrTitle: (nrNumber: string) => string;
  onAddNorma: () => void;
  onImportItems: () => void;
  onExportItems: () => void;
}

const NRChecklistSelection: React.FC<NRChecklistSelectionProps> = ({
  normas,
  selectedNr,
  setSelectedNr,
  getNrTitle,
  onAddNorma,
  onImportItems,
  onExportItems,
}) => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks className="h-5 w-5" /> Selecionar Normativa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="nr-select">Normativa</Label>
            <Select value={selectedNr || ""} onValueChange={setSelectedNr}>
              <SelectTrigger id="nr-select">
                <SelectValue placeholder="Selecione uma normativa" />
              </SelectTrigger>
              <SelectContent>
                {normas.map((nr) => (
                  <SelectItem key={nr.id} value={nr.nr_number}>
                    {nr.nr_number} - {nr.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedNr && (
            <>
              <Button variant="outline" className="w-full" onClick={onAddNorma}>
                <Plus className="h-4 w-4 mr-2" /> Adicionar Nova Normativa
              </Button>
              <Button variant="outline" className="w-full" onClick={onImportItems}>
                <Upload className="h-4 w-4 mr-2" /> Importar Itens de Checklist
              </Button>
              <Button variant="outline" className="w-full" onClick={onExportItems}>
                <Download className="h-4 w-4 mr-2" /> Exportar Itens de Checklist
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NRChecklistSelection;