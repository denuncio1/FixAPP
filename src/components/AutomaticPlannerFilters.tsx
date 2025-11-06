"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Sparkles, X } from "lucide-react";

interface Technician {
  id: string;
  name: string;
  color: string;
  skills: string[];
  startLat: number;
  startLng: number;
}

interface AutomaticPlannerFiltersProps {
  mockTechnicians: Technician[];
  availableSkills: string[];
  selectedTechnicianIds: string[];
  setSelectedTechnicianIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSkillFilter: string | null;
  setSelectedSkillFilter: React.Dispatch<React.SetStateAction<string | null>>;
  onSimulate: () => void;
}

const AutomaticPlannerFilters: React.FC<AutomaticPlannerFiltersProps> = ({
  mockTechnicians,
  availableSkills,
  selectedTechnicianIds,
  setSelectedTechnicianIds,
  selectedSkillFilter,
  setSelectedSkillFilter,
  onSimulate,
}) => {
  const [currentTechnicianSelection, setCurrentTechnicianSelection] = useState<string>(""); // Novo estado para o valor do Select de técnicos

  const handleSkillFilterChange = (value: string) => {
    setSelectedSkillFilter(value === "all" ? null : value);
  };

  return (
    <Card className="lg:col-span-1 xl:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" /> Filtros de Planejamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="technicians" className="block text-sm font-medium text-foreground mb-1">
            Técnicos
          </label>
          <Select
            value={currentTechnicianSelection} // Controlado pelo novo estado
            onValueChange={(value) => {
              if (value && !selectedTechnicianIds.includes(value)) { // Garante que o valor não é vazio e não está duplicado
                setSelectedTechnicianIds((prev) => [...prev, value]);
              }
              setCurrentTechnicianSelection(""); // Reseta o select para mostrar o placeholder
            }}
          >
            <SelectTrigger id="technicians">
              <SelectValue placeholder="Selecione técnicos" />
            </SelectTrigger>
            <SelectContent>
              {mockTechnicians.map((tech) => (
                <SelectItem key={tech.id} value={tech.id} disabled={selectedTechnicianIds.includes(tech.id)}>
                  {tech.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTechnicianIds.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedTechnicianIds.map((id) => {
                const tech = mockTechnicians.find((t) => t.id === id);
                return tech ? (
                  <Badge key={id} variant="secondary" className="flex items-center gap-1">
                    {tech.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
                      onClick={() => setSelectedTechnicianIds((prev) => prev.filter((tid) => tid !== id))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="skillFilter" className="block text-sm font-medium text-foreground mb-1">
            Filtrar por Habilidade
          </label>
          <Select
            onValueChange={handleSkillFilterChange}
            value={selectedSkillFilter || "all"} // Se null, exibe "all"
          >
            <SelectTrigger id="skillFilter">
              <SelectValue placeholder="Todas as habilidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as habilidades</SelectItem> {/* Valor alterado para "all" */}
              {availableSkills.map((skill) => (
                <SelectItem key={skill} value={skill}>
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full" onClick={onSimulate}>
          <Sparkles className="h-4 w-4 mr-2" /> Otimizar Rotas
        </Button>
      </CardContent>
    </Card>
  );
};

export default AutomaticPlannerFilters;