"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Menu, MapPin, Car, Users, Wrench, Sparkles } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GoogleMap, useLoadScript, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge"; // Importar Badge
import { X } from "lucide-react"; // Importar X para o botão de remover

// Mock Data
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
  const [assignedRoutes, setAssignedRoutes] = useState<Record<string, google.maps.DirectionsResult | null>>({});
  const [technicianTravelSummaries, setTechnicianTravelSummaries] = useState<Record<string, { totalTime: string; segmentTimes: string[] }>>({});
  const [assignedWorkOrders, setAssignedWorkOrders] = useState<Record<string, WorkOrder[]>>({});

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const { isLoaded, loadError } = useLoadScript({
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

  const handleSimulate = async () => {
    if (!isLoaded) {
      toast.error("Google Maps não carregado. Tente novamente.");
      return;
    }
    if (selectedTechnicianIds.length === 0) {
      toast.error("Selecione pelo menos um técnico para simular.");
      return;
    }

    const selectedTechnicians = mockTechnicians.filter(tech => selectedTechnicianIds.includes(tech.id));
    let filteredOrders = mockWorkOrders;

    if (selectedSkillFilter) {
      filteredOrders = filteredOrders.filter(order => order.requiredSkill === selectedSkillFilter);
    }

    if (filteredOrders.length === 0) {
      toast.info("Nenhuma ordem de serviço encontrada para os filtros selecionados.");
      setAssignedRoutes({});
      setTechnicianTravelSummaries({});
      setAssignedWorkOrders({});
      return;
    }

    const origins = selectedTechnicians.map(tech => ({ lat: tech.startLat, lng: tech.startLng }));
    const destinations = filteredOrders.map(order => ({ lat: order.lat, lng: order.lng }));

    const distanceMatrixService = new google.maps.DistanceMatrixService();

    try {
      const response = await distanceMatrixService.getDistanceMatrix({
        origins: origins,
        destinations: destinations,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      });

      const newAssignedWorkOrders: Record<string, WorkOrder[]> = selectedTechnicians.reduce((acc, tech) => ({ ...acc, [tech.id]: [] }), {});
      const technicianCurrentLocations = new Map(selectedTechnicians.map(tech => [tech.id, { lat: tech.startLat, lng: tech.startLng }]));
      const technicianRoutes: Record<string, { waypoints: google.maps.DirectionsWaypoint[], origin: google.maps.LatLngLiteral | string, destination: google.maps.LatLngLiteral | string }> = selectedTechnicians.reduce((acc, tech) => ({ ...acc, [tech.id]: { waypoints: [], origin: { lat: tech.startLat, lng: tech.startLng }, destination: { lat: tech.startLat, lng: tech.startLng } } }), {});

      const unassignedOrders = [...filteredOrders];

      // Simple greedy assignment: assign each order to the closest, skilled, and available technician
      // This is a simplification; real-world optimization is more complex (e.g., TSP)
      while (unassignedOrders.length > 0) {
        let bestTechnicianId: string | null = null;
        let bestOrderId: string | null = null;
        let minTravelTime = Infinity;

        for (const order of unassignedOrders) {
          for (const tech of selectedTechnicians) {
            if (tech.skills.includes(order.requiredSkill)) {
              // Find the index of the current technician and order in the original matrix
              const techIndex = selectedTechnicians.findIndex(t => t.id === tech.id);
              const orderIndex = filteredOrders.findIndex(o => o.id === order.id);

              if (response.rows[techIndex] && response.rows[techIndex].elements[orderIndex]) {
                const element = response.rows[techIndex].elements[orderIndex];
                if (element.status === "OK" && element.duration && element.duration.value < minTravelTime) {
                  minTravelTime = element.duration.value;
                  bestTechnicianId = tech.id;
                  bestOrderId = order.id;
                }
              }
            }
          }
        }

        if (bestTechnicianId && bestOrderId) {
          const assignedOrder = unassignedOrders.find(order => order.id === bestOrderId);
          if (assignedOrder) {
            newAssignedWorkOrders[bestTechnicianId].push(assignedOrder);
            // Update technician's current location for subsequent assignments (simple greedy)
            technicianCurrentLocations.set(bestTechnicianId, { lat: assignedOrder.lat, lng: assignedOrder.lng });
            // Add to technician's route waypoints
            technicianRoutes[bestTechnicianId].waypoints.push({ location: { lat: assignedOrder.lat, lng: assignedOrder.lng }, stopover: true });
            technicianRoutes[bestTechnicianId].destination = { lat: assignedOrder.lat, lng: assignedOrder.lng }; // Update final destination
            unassignedOrders.splice(unassignedOrders.findIndex(order => order.id === bestOrderId), 1);
          }
        } else {
          // No suitable technician found for remaining orders
          break;
        }
      }

      setAssignedWorkOrders(newAssignedWorkOrders);

      const newAssignedRoutes: Record<string, google.maps.DirectionsResult | null> = {};
      const newTechnicianTravelSummaries: Record<string, { totalTime: string; segmentTimes: string[] }> = {};

      for (const tech of selectedTechnicians) {
        const techOrders = newAssignedWorkOrders[tech.id];
        if (techOrders.length > 0) {
          const directionsService = new google.maps.DirectionsService();
          const origin = { lat: tech.startLat, lng: tech.startLng };
          const destination = { lat: techOrders[techOrders.length - 1].lat, lng: techOrders[techOrders.length - 1].lng };
          const waypoints = techOrders.slice(0, techOrders.length - 1).map(order => ({
            location: { lat: order.lat, lng: order.lng },
            stopover: true,
          }));

          const result = await directionsService.route({
            origin: origin,
            destination: destination,
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
          });

          if (result.routes && result.routes.length > 0) {
            newAssignedRoutes[tech.id] = result;
            let totalDuration = 0;
            const segmentTimes: string[] = [];

            result.routes[0].legs.forEach((leg, index) => {
              if (leg.duration) {
                totalDuration += leg.duration.value;
                const startOrder = index === 0 ? { id: "Base" } : techOrders[index - 1];
                const endOrder = techOrders[index];
                segmentTimes.push(
                  `Entre ${startOrder.id} e OS ${endOrder.id}: ${Math.ceil(leg.duration.value / 60)} min`
                );
              }
            });
            newTechnicianTravelSummaries[tech.id] = {
              totalTime: `${Math.ceil(totalDuration / 60)} min`,
              segmentTimes: segmentTimes,
            };
          }
        } else {
          newAssignedRoutes[tech.id] = null;
          newTechnicianTravelSummaries[tech.id] = { totalTime: "N/A", segmentTimes: [] };
        }
      }

      setAssignedRoutes(newAssignedRoutes);
      setTechnicianTravelSummaries(newTechnicianTravelSummaries);
      toast.success("Simulação de rota concluída!");

    } catch (error) {
      console.error("Erro ao calcular rota ou matriz de distância:", error);
      toast.error("Erro ao calcular rota. Verifique a chave da API e as coordenadas.");
    }
  };

  if (loadError) return <div>Erro ao carregar o mapa: {loadError.message}</div>;
  if (!isLoaded) return <div>Carregando Mapa...</div>;

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
                    onValueChange={(value) => {
                      // Allow selecting multiple technicians, but for simplicity, let's just add/remove
                      // For this UI, we'll use two separate selects as before, but update the state to an array
                      if (!selectedTechnicianIds.includes(value)) {
                        setSelectedTechnicianIds(prev => [...prev, value]);
                      } else {
                        setSelectedTechnicianIds(prev => prev.filter(id => id !== value));
                      }
                    }}
                    value={selectedTechnicianIds[0] || ""} // Display first selected technician
                  >
                    <SelectTrigger id="technicians">
                      <SelectValue placeholder="Selecione técnicos" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTechnicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name} {selectedTechnicianIds.includes(tech.id) && "(Selecionado)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTechnicianIds.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedTechnicianIds.map(id => {
                        const tech = mockTechnicians.find(t => t.id === id);
                        return tech ? (
                          <Badge key={id} variant="secondary" className="flex items-center gap-1">
                            {tech.name}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0"
                              onClick={() => setSelectedTechnicianIds(prev => prev.filter(tid => tid !== id))}
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
                  <Select onValueChange={setSelectedSkillFilter} value={selectedSkillFilter || ""}>
                    <SelectTrigger id="skillFilter">
                      <SelectValue placeholder="Todas as habilidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas as habilidades</SelectItem>
                      {availableSkills.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill.charAt(0).toUpperCase() + skill.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleSimulate}>
                  <Sparkles className="h-4 w-4 mr-2" /> Otimizar Rotas
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-1 xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" /> Ordens de Serviço do Dia (Filtradas)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>OS Nº</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Endereço</TableHead>
                      <TableHead>Tipo de Serviço</TableHead>
                      <TableHead>Habilidade</TableHead>
                      <TableHead>Horário Previsto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockWorkOrders
                      .filter(order => !selectedSkillFilter || order.requiredSkill === selectedSkillFilter)
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.client}</TableCell>
                          <TableCell>{order.address}</TableCell>
                          <TableCell>{order.type}</TableCell>
                          <TableCell>{order.requiredSkill}</TableCell>
                          <TableCell>{order.scheduledTime}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Mapa de Rotas Otimizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full rounded-md overflow-hidden">
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={center}
                  zoom={12}
                >
                  {mockWorkOrders
                    .filter(order => !selectedSkillFilter || order.requiredSkill === selectedSkillFilter)
                    .map((order) => (
                      <MarkerF
                        key={order.id}
                        position={{ lat: order.lat, lng: order.lng }}
                        title={`${order.type} (${order.client})`}
                      />
                    ))}
                  {selectedTechnicianIds.map(techId => { {/* Corrigido aqui */}
                    const tech = mockTechnicians.find(t => t.id === techId);
                    if (tech && assignedRoutes[techId]) {
                      return (
                        <DirectionsRenderer
                          key={techId}
                          directions={assignedRoutes[techId]}
                          options={{
                            polylineOptions: {
                              strokeColor: tech.color,
                              strokeWeight: 5,
                              strokeOpacity: 0.8,
                            },
                            markerOptions: {
                              icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 8,
                                fillColor: tech.color,
                                fillOpacity: 1,
                                strokeWeight: 2,
                                strokeColor: "#fff",
                              },
                            },
                          }}
                        />
                      );
                    }
                    return null;
                  })}
                </GoogleMap>
              </div>
            </CardContent>
          </Card>

          {selectedTechnicianIds.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {selectedTechnicianIds.map(techId => { {/* Corrigido aqui */}
                const tech = mockTechnicians.find(t => t.id === techId);
                const summary = technicianTravelSummaries[techId];
                const orders = assignedWorkOrders[techId];

                if (!tech || !summary) return null;

                return (
                  <Card key={techId}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5" style={{ color: tech.color }} /> Deslocamento Previsto: {tech.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {orders && orders.length > 0 ? (
                        <>
                          <h3 className="font-semibold mb-2">Ordens Atribuídas:</h3>
                          <ul className="list-disc pl-5 mb-4 text-sm text-muted-foreground">
                            {orders.map(order => (
                              <li key={order.id}>{order.id} - {order.type} ({order.client})</li>
                            ))}
                          </ul>
                          <h3 className="font-semibold mb-2">Tempos de Viagem:</h3>
                          <ul className="space-y-1 mb-2">
                            {summary.segmentTimes.map((time, index) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                {time}
                              </li>
                            ))}
                          </ul>
                          <p className="text-lg font-semibold mt-4">
                            Tempo total estimado de deslocamento: {summary.totalTime}
                          </p>
                        </>
                      ) : (
                        <p className="text-muted-foreground">Nenhuma ordem de serviço atribuída a {tech.name} com os filtros atuais.</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-2">
                        *Esta é uma simulação. A precisão depende da chave da API do Google Maps e da lógica de otimização.
                      </p>
                    </CardContent>
                  </Card>
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