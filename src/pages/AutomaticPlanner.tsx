"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Menu, MapPin, Car, Users, Wrench } from "lucide-react";
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

// Mock Data
interface Technician {
  id: string;
  name: string;
  color: string; // Para diferenciar no mapa
}

interface WorkOrder {
  id: string;
  client: string;
  address: string;
  type: string; // Usado como título para o marcador
  scheduledTime: string;
  lat: number;
  lng: number;
}

const mockTechnicians: Technician[] = [
  { id: "tech1", name: "Ana Santos", color: "#FF0000" },
  { id: "tech2", name: "João Silva", color: "#0000FF" },
  { id: "tech3", name: "Maria Souza", color: "#00FF00" },
];

const mockWorkOrders: WorkOrder[] = [
  {
    id: "1023",
    client: "Ana Martins",
    address: "Rua das Flores, 123",
    type: "Instalação de Wi-Fi",
    scheduledTime: "09:00",
    lat: -23.55052, // Exemplo de coordenadas para São Paulo
    lng: -46.633307,
  },
  {
    id: "1024",
    client: "Pedro Oliveira",
    address: "Av. Central, 456",
    type: "Manutenção elétrica",
    scheduledTime: "11:00",
    lat: -23.56052,
    lng: -46.643307,
  },
  {
    id: "1025",
    client: "Carla Mendes",
    address: "Rua Azul, 789",
    type: "Troca de fechadura",
    scheduledTime: "14:00",
    lat: -23.57052,
    lng: -46.653307,
  },
  {
    id: "1026",
    client: "Empresa X",
    address: "Rua Verde, 10",
    type: "Reparo de rede",
    scheduledTime: "10:00",
    lat: -23.54552,
    lng: -46.625307,
  },
];

const AutomaticPlanner = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTechnician1, setSelectedTechnician1] = useState<string | null>(null);
  const [selectedTechnician2, setSelectedTechnician2] = useState<string | null>(null);
  const [simulatedRoutes, setSimulatedRoutes] = useState<google.maps.DirectionsResult | null>(null);
  const [totalTravelTime, setTotalTravelTime] = useState<string | null>(null);
  const [travelTimesBetweenOrders, setTravelTimesBetweenOrders] = useState<string[]>([]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Carrega o script do Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "", // Use sua chave de API aqui
    libraries: ["places", "geometry"],
  });

  const center = useMemo(() => ({ lat: -23.55052, lng: -46.633307 }), []); // Centro inicial do mapa (São Paulo)

  const handleSimulate = async () => {
    if (!isLoaded) {
      toast.error("Google Maps não carregado. Tente novamente.");
      return;
    }
    if (!selectedTechnician1 && !selectedTechnician2) {
      toast.error("Selecione pelo menos um técnico para simular.");
      return;
    }

    // Lógica de simulação (simplificada para demonstração)
    // Em um cenário real, você faria chamadas a um serviço de rotas
    // e otimização para calcular as melhores rotas e tempos.

    const directionsService = new google.maps.DirectionsService();
    const waypoints = mockWorkOrders.slice(1, mockWorkOrders.length -1).map(order => ({
      location: { lat: order.lat, lng: order.lng },
      stopover: true,
    }));

    try {
      const result = await directionsService.route({
        origin: { lat: mockWorkOrders[0].lat, lng: mockWorkOrders[0].lng },
        destination: { lat: mockWorkOrders[mockWorkOrders.length - 1].lat, lng: mockWorkOrders[mockWorkOrders.length - 1].lng },
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      if (result.routes && result.routes.length > 0) {
        setSimulatedRoutes(result);
        let totalDuration = 0;
        const segmentTimes: string[] = [];

        result.routes[0].legs.forEach((leg, index) => {
          if (leg.duration) {
            totalDuration += leg.duration.value;
            if (index < result.routes[0].legs.length - 1) {
              segmentTimes.push(
                `Entre OS ${mockWorkOrders[index].id} e ${mockWorkOrders[index + 1].id}: ${Math.ceil(leg.duration.value / 60)} min`
              );
            }
          }
        });
        setTotalTravelTime(`${Math.ceil(totalDuration / 60)} min`);
        setTravelTimesBetweenOrders(segmentTimes);
        toast.success("Simulação de rota concluída!");
      } else {
        toast.error("Não foi possível calcular a rota.");
      }
    } catch (error) {
      console.error("Erro ao calcular rota:", error);
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
                  <Users className="h-5 w-5" /> Filtro de Técnicos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="technician1" className="block text-sm font-medium text-foreground mb-1">
                    Técnico 1
                  </label>
                  <Select onValueChange={setSelectedTechnician1} value={selectedTechnician1 || ""}>
                    <SelectTrigger id="technician1">
                      <SelectValue placeholder="Selecione um técnico" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTechnicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="technician2" className="block text-sm font-medium text-foreground mb-1">
                    Técnico 2 (Opcional)
                  </label>
                  <Select onValueChange={setSelectedTechnician2} value={selectedTechnician2 || ""}>
                    <SelectTrigger id="technician2">
                      <SelectValue placeholder="Selecione outro técnico" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTechnicians.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleSimulate}>
                  <Car className="h-4 w-4 mr-2" /> Executar Simulação
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-1 xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" /> Ordens de Serviço do Dia
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
                      <TableHead>Horário Previsto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockWorkOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.client}</TableCell>
                        <TableCell>{order.address}</TableCell>
                        <TableCell>{order.type}</TableCell>
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
                <MapPin className="h-5 w-5" /> Mapa de Rotas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full rounded-md overflow-hidden">
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={center}
                  zoom={12}
                >
                  {mockWorkOrders.map((order) => (
                    <MarkerF
                      key={order.id}
                      position={{ lat: order.lat, lng: order.lng }}
                      title={order.type} // Corrigido para usar 'order.type'
                      // Você pode personalizar o ícone aqui com base no tipo de serviço ou técnico
                    />
                  ))}
                  {simulatedRoutes && (
                    <DirectionsRenderer directions={simulatedRoutes} />
                  )}
                </GoogleMap>
              </div>
            </CardContent>
          </Card>

          {simulatedRoutes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" /> Deslocamento Previsto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 mb-2">
                  {travelTimesBetweenOrders.map((time, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {time}
                    </li>
                  ))}
                </ul>
                <p className="text-lg font-semibold">
                  Tempo total estimado de deslocamento: {totalTravelTime}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  *Esta é uma simulação. A precisão depende da chave da API do Google Maps e da lógica de otimização.
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default AutomaticPlanner;