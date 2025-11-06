"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Technician } from "@/types/technician"; // Importar a interface Technician global
import { WorkOrder } from "@/types/work-order"; // Importar a interface WorkOrder global

interface RouteOptimizationResult {
  assignedRoutes: Record<string, google.maps.DirectionsResult | null>;
  technicianTravelSummaries: Record<string, { totalTime: string; segmentTimes: string[] }>;
  assignedWorkOrders: Record<string, WorkOrder[]>;
  simulateRoutes: () => Promise<void>;
}

export const useRouteOptimization = (
  isMapsLoaded: boolean,
  selectedTechnicianIds: string[],
  selectedSkillFilter: string | null,
  mockTechnicians: Technician[],
  mockWorkOrders: WorkOrder[]
): RouteOptimizationResult => {
  const [assignedRoutes, setAssignedRoutes] = useState<Record<string, google.maps.DirectionsResult | null>>({});
  const [technicianTravelSummaries, setTechnicianTravelSummaries] = useState<Record<string, { totalTime: string; segmentTimes: string[] }>>({});
  const [assignedWorkOrders, setAssignedWorkOrders] = useState<Record<string, WorkOrder[]>>({});

  const simulateRoutes = useCallback(async () => {
    if (!isMapsLoaded) {
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
    const destinations = filteredOrders.map(order => ({ lat: order.lat!, lng: order.lng! })); // Usar ! para afirmar que não são nulos aqui

    const distanceMatrixService = new google.maps.DistanceMatrixService();

    try {
      const response = await distanceMatrixService.getDistanceMatrix({
        origins: origins,
        destinations: destinations,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      });

      const newAssignedWorkOrders: Record<string, WorkOrder[]> = selectedTechnicians.reduce((acc, tech) => ({ ...acc, [tech.id]: [] }), {});
      const unassignedOrders = [...filteredOrders];

      // Simple greedy assignment: assign each order to the closest, skilled, and available technician
      while (unassignedOrders.length > 0) {
        let bestTechnicianId: string | null = null;
        let bestOrderId: string | null = null;
        let minTravelTime = Infinity;

        for (const order of unassignedOrders) {
          for (const tech of selectedTechnicians) {
            if (tech.skills.includes(order.requiredSkill!)) { // Usar ! para afirmar que não é nulo
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
            unassignedOrders.splice(unassignedOrders.findIndex(order => order.id === bestOrderId), 1);
          }
        } else {
          break; // No suitable technician found for remaining orders
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
          const destination = { lat: techOrders[techOrders.length - 1].lat!, lng: techOrders[techOrders.length - 1].lng! }; // Usar !
          const waypoints = techOrders.slice(0, techOrders.length - 1).map(order => ({
            location: { lat: order.lat!, lng: order.lng! }, // Usar !
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
                const startPoint = index === 0 ? "Base" : `OS ${techOrders[index - 1].id}`;
                const endPoint = `OS ${techOrders[index].id}`;
                segmentTimes.push(
                  `Entre ${startPoint} e ${endPoint}: ${Math.ceil(leg.duration.value / 60)} min`
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
  }, [isMapsLoaded, selectedTechnicianIds, selectedSkillFilter, mockTechnicians, mockWorkOrders]);

  return { assignedRoutes, technicianTravelSummaries, assignedWorkOrders, simulateRoutes };
};