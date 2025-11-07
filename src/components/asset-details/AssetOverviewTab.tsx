"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, MapPin, User, CalendarCheck, Clock } from "lucide-react";
import { Asset } from "@/types/asset";
import { Location } from "@/types/location";
import { Technician } from "@/types/technician";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AssetOverviewTabProps {
  asset: Asset;
  locations: Location[];
  technicians: Technician[];
}

const AssetOverviewTab: React.FC<AssetOverviewTabProps> = ({ asset, locations, technicians }) => {
  const getLocationName = (locationId?: string) => {
    if (!locationId) return "N/A";
    const location = locations.find(loc => loc.id === locationId);
    return location ? location.name : "Desconhecida";
  };

  const getTechnicianName = (technicianId?: string) => {
    if (!technicianId) return "N/A";
    const technician = technicians.find(tech => tech.id === technicianId);
    return technician ? technician.name : "Desconhecido";
  };

  const formatDateOnly = (isoString?: string) => {
    if (!isoString) return "N/A";
    return format(new Date(isoString), "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Foto do Ativo</CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src={asset.photoUrl || "/placeholder.svg"}
            alt={asset.name}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <p className="text-sm text-muted-foreground">{asset.description}</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Detalhes Principais</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <p><span className="font-medium flex items-center gap-1"><Package className="h-4 w-4" /> Código:</span> {asset.code}</p>
          <p><span className="font-medium flex items-center gap-1"><MapPin className="h-4 w-4" /> Localização:</span> {getLocationName(asset.locationId)}</p>
          <p><span className="font-medium flex items-center gap-1"><User className="h-4 w-4" /> Técnico Responsável:</span> {getTechnicianName(asset.assignedTechnicianId)}</p>
          <p><span className="font-medium flex items-center gap-1"><CalendarCheck className="h-4 w-4" /> Data de Compra:</span> {formatDateOnly(asset.purchaseDate)}</p>
          <p><span className="font-medium flex items-center gap-1"><Clock className="h-4 w-4" /> Última Manutenção:</span> {formatDateOnly(asset.lastMaintenanceDate)}</p>
          <p><span className="font-medium flex items-center gap-1"><CalendarCheck className="h-4 w-4" /> Próxima Manutenção:</span> {formatDateOnly(asset.nextMaintenanceDate)}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetOverviewTab;