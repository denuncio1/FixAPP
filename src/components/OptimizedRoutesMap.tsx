"use client";

import React from "react";
import { GoogleMap, MarkerF, DirectionsRenderer } from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

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

interface OptimizedRoutesMapProps {
  center: { lat: number; lng: number };
  isMapsLoaded: boolean;
  mockWorkOrders: WorkOrder[];
  selectedSkillFilter: string | null;
  selectedTechnicianIds: string[];
  mockTechnicians: Technician[];
  assignedRoutes: Record<string, google.maps.DirectionsResult | null>;
}

const OptimizedRoutesMap: React.FC<OptimizedRoutesMapProps> = ({
  center,
  isMapsLoaded,
  mockWorkOrders,
  selectedSkillFilter,
  selectedTechnicianIds,
  mockTechnicians,
  assignedRoutes,
}) => {
  if (!isMapsLoaded) return <div>Carregando Mapa...</div>;

  const filteredWorkOrders = mockWorkOrders.filter(
    (order) => !selectedSkillFilter || order.requiredSkill === selectedSkillFilter
  );

  return (
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
            {filteredWorkOrders.map((order) => (
              <MarkerF
                key={order.id}
                position={{ lat: order.lat, lng: order.lng }}
                title={`${order.type} (${order.client})`}
              />
            ))}
            {selectedTechnicianIds.map((techId) => {
              const tech = mockTechnicians.find((t) => t.id === techId);
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
  );
};

export default OptimizedRoutesMap;