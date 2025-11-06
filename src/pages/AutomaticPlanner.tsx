"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { useLoadScript } from "@react-google-maps/api";
import { useRouteOptimization } from "@/hooks/useRouteOptimization";
import AutomaticPlannerFilters from "@/components/AutomaticPlannerFilters";
import WorkOrdersTableDisplay from "@/components/WorkOrdersTableDisplay";
import OptimizedRoutesMap from "@/components/OptimizedRoutesMap";
import TechnicianRouteSummary from "@/components/TechnicianRouteSummary";

// Mock Data - Definido aqui e passado para os componentes
interface Technician {
  id: string;
  name: string;
  color: string;
  skills: string[];
  startLat: number;
  startLng: number;
}

interface WorkOrder {
  id: string;
  client: string;
  address: string;
  type: string;
  scheduledTime: string;
  lat: number;
  lng: number;
  requiredSkill: string;
}

const mockTechnicians: Technician[] = [
  { id: "tech1", name: "Ana Santos", color: "#FF0000", skills: ["elétrica", "hidráulica"], startLat: -23.55052, startLng: -46.633307 }, // São Paulo
  { id: "tech2", name: "João Silva", color: "#0000FF", skills: ["refrigeração", "elétrica"], startLat: -23.56052, startLng: -46.643307 }, // São Paulo
  { id: "tech3", name: "Maria Souza", color: "#00FF00", skills: ["hidráulica"], startLat: -23.54052, startLng: -46.623307 }, // São Paulo
];

const mockWorkOrders: WorkOrder[] = [
  {
    id: "1023",
    client: "Ana Martins",
    address: "Rua das Flores, 123, Bela Vista, São Paulo",
    type: "Instalação de Wi-Fi",
    scheduledTime: "09:00",
    lat: -23.561355,
    lng: -46.656003,
    requiredSkill: "elétrica",
  },
  {
    id: "1024",
    client: "Pedro Oliveira",
    address: "Av. Paulista, 1578, Cerqueira César, São Paulo",
    type: "Manutenção elétrica",
    scheduledTime: "11:00",
    lat: -23.561355,
    lng: -46.656003,
    requiredSkill: "elétrica",
  },
  {
    id: "1025",
    client: "Carla Mendes",
    address: "Rua Augusta, 2690, Cerqueira César, São Paulo",
    type: "Troca de fechadura",
    scheduledTime: "14:00",
    lat: -23.561355,
    lng: -46.656003,
    requiredSkill: "hidráulica",
  },
  {
    id: "1026",
    client: "Empresa X",
    address: "Rua Oscar Freire, 1000, Jardins, São Paulo",
    type: "Reparo de rede",
    scheduledTime: "10:00",
    lat: -23.561355,
    lng: -46.656003,
    requiredSkill: "elétrica",
  },
  {
    id: "1027",
    client: "Condomínio Y",
    address: "Rua Haddock Lobo, 1300, Cerqueira César, São Paulo",
    type: "Manutenção de ar condicionado",
    scheduledTime: "15:00",
    lat: -23.561355,
    lng: -46.656003,
    requiredSkill: "refrigeração",
  },
];

const AutomaticPlanner = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTechnicianIds, setSelectedTechnicianIds] = useState<string[]>([]);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string | null>(null);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const { isLoaded: isMapsLoaded, loadError: mapsLoadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places", "geometry"],
  });

  const center = useMemo(() => ({ lat: -23.55052, lng: -46.633307 }), []);

  const availableSkills = useMemo(() => {
    const skills = new Set<string>();
    mockTechnicians.forEach(tech => tech.skills.forEach(skill => skills.add(skill)));
    mockWorkOrders.forEach(order => skills.add(order.requiredSkill));
    return Array.from(skills);
  }, []);

  const { assignedRoutes, technicianTravelSummaries, assignedWorkOrders, simulateRoutes } = useRouteOptimization(
    isMapsLoaded,
    selectedTechnicianIds,
    selectedSkillFilter,
    mockTechnicians,
    mockWorkOrders
  );

  if (mapsLoadError) return <div>Erro ao carregar o mapa: {mapsLoadError.message}</div>;
  if (!isMapsLoaded) return <div>Carregando Mapa...</div>;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center border-b bg-card px-4">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Planejador Automático - FixApp</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Planejador Automático</h2>
            <p className="text-muted-foreground">
              Otimize as rotas e a distribuição de ordens de serviço para seus técnicos.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 mb-6">
            <AutomaticPlannerFilters
              mockTechnicians={mockTechnicians}
              availableSkills={availableSkills}
              selectedTechnicianIds={selectedTechnicianIds}
              setSelectedTechnicianIds={setSelectedTechnicianIds}
              selectedSkillFilter={selectedSkillFilter}
              setSelectedSkillFilter={setSelectedSkillFilter}
              onSimulate={simulateRoutes}
            />

            <WorkOrdersTableDisplay
              mockWorkOrders={mockWorkOrders}
              selectedSkillFilter={selectedSkillFilter}
            />
          </div>

          <OptimizedRoutesMap
            center={center}
            isMapsLoaded={isMapsLoaded}
            mockWorkOrders={mockWorkOrders}
            selectedSkillFilter={selectedSkillFilter}
            selectedTechnicianIds={selectedTechnicianIds}
            mockTechnicians={mockTechnicians}
            assignedRoutes={assignedRoutes}
          />

          {selectedTechnicianIds.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {selectedTechnicianIds.map((techId) => {
                const tech = mockTechnicians.find((t) => t.id === techId);
                const summary = technicianTravelSummaries[techId];
                const orders = assignedWorkOrders[techId];

                if (!tech || !summary) return null;

                return (
                  <TechnicianRouteSummary
                    key={techId}
                    technician={tech}
                    summary={summary}
                    assignedOrders={orders || []}
                  />
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AutomaticPlanner;