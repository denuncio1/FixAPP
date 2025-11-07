"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Building2, Eye, MapPin } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Location } from "@/types/location"; // Importar a interface Location
import { Menu } from "lucide-react";

// Mock Data para Localizações
const mockLocations: Location[] = [
  { id: "loc1", name: "Filial Centro", address: "Rua A, 123, São Paulo - SP", lat: -23.55052, lng: -46.633307, description: "Escritório principal e área de atendimento.", photoUrl: "/placeholder.svg", iconType: "office", status: "active", iotDevices: ["Sensor de Presença", "Câmera de Segurança"], operatingHours: "Seg-Sex, 8h-18h" },
  { id: "loc2", name: "Armazém Sul", address: "Av. B, 456, Campinas - SP", lat: -22.9099, lng: -47.0626, description: "Armazém de estoque e logística.", photoUrl: "/placeholder.svg", iconType: "factory", status: "active", iotDevices: ["Sensor de Umidade", "Controle de Acesso"], operatingHours: "Seg-Sab, 7h-19h" },
  { id: "loc3", name: "Pátio de Manutenção", address: "Rua C, 789, Guarulhos - SP", lat: -23.4634, lng: -46.5333, description: "Área externa para manutenção de veículos pesados.", photoUrl: "/placeholder.svg", iconType: "field", status: "inactive", iotDevices: [], operatingHours: "Seg-Sex, 9h-17h" },
  { id: "loc4", name: "Escritório Remoto", address: "Rua D, 101, Rio de Janeiro - RJ", lat: -22.9068, lng: -43.1729, description: "Ponto de apoio para equipe no Rio.", photoUrl: "/placeholder.svg", iconType: "office", status: "active", iotDevices: [], operatingHours: "Seg-Sex, 9h-18h" },
];

const Locations = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const filteredLocations = mockLocations.filter((loc) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-xl font-semibold">Localizações</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Gerenciar Localizações</h2>
            <p className="text-muted-foreground">
              Visualize, edite e cadastre os locais de operação.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, endereço ou descrição..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button className="flex items-center gap-2 w-full md:w-auto" onClick={() => navigate("/locations/new")}>
              <Plus className="h-4 w-4" />
              Nova Localização
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Localizações</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((loc) => (
                      <TableRow key={loc.id}>
                        <TableCell className="font-medium">{loc.name}</TableCell>
                        <TableCell>{loc.address}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              loc.status === "active"
                                ? "bg-green-100 text-green-800 hover:bg-green-100/80"
                                : "bg-red-100 text-red-800 hover:bg-red-100/80"
                            }
                          >
                            {loc.status === "active" ? "Ativa" : "Inativa"}
                          </Badge>
                        </TableCell>
                        <TableCell>{loc.iconType || "Outro"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => console.log("Ver detalhes da localização:", loc.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                        Nenhuma localização encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Locations;