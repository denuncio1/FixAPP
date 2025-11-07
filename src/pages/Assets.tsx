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
import { Plus, Search, Package, Eye } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Menu } from "lucide-react";
import { Asset } from "@/types/asset"; // Importar a interface Asset
import { Location } from "@/types/location"; // Importar a interface Location

// Mock Data para Localizações (para exibir o nome da localização)
const mockLocations: Location[] = [
  { id: "loc1", name: "Filial Centro", address: "Rua A, 123", lat: -23.55052, lng: -46.633307, status: "active" },
  { id: "loc2", name: "Armazém Sul", address: "Av. B, 456", lat: -23.65052, lng: -46.733307, status: "active" },
  { id: "loc3", name: "Escritório Principal", address: "Rua C, 789", lat: -23.50052, lng: -46.603307, status: "active" },
];

// Mock Data para Ativos
const mockAssets: Asset[] = [
  {
    id: "asset1",
    name: "Máquina de Produção X",
    code: "MPX-001",
    description: "Máquina principal da linha de produção.",
    status: "Operacional",
    locationId: "loc1",
    purchaseDate: "2022-01-15T00:00:00Z",
    lastMaintenanceDate: "2024-10-20T00:00:00Z",
    nextMaintenanceDate: "2025-01-20T00:00:00Z",
    activityHistory: [{ timestamp: "2022-01-15T00:00:00Z", action: "Ativo Registrado" }],
  },
  {
    id: "asset2",
    name: "Gerador de Energia Principal",
    code: "GEN-001",
    description: "Gerador de backup para toda a unidade.",
    status: "Em Manutenção",
    locationId: "loc2",
    purchaseDate: "2021-05-10T00:00:00Z",
    lastMaintenanceDate: "2024-09-01T00:00:00Z",
    nextMaintenanceDate: "2024-11-15T00:00:00Z",
    activityHistory: [{ timestamp: "2021-05-10T00:00:00Z", action: "Ativo Registrado" }],
  },
  {
    id: "asset3",
    name: "Sistema HVAC Sala Servidor",
    code: "HVAC-003",
    description: "Sistema de climatização dedicado à sala de servidores.",
    status: "Operacional",
    locationId: "loc1",
    purchaseDate: "2023-03-01T00:00:00Z",
    lastMaintenanceDate: "2024-08-10T00:00:00Z",
    nextMaintenanceDate: "2024-11-07T00:00:00Z", // Em atraso
    activityHistory: [{ timestamp: "2023-03-01T00:00:00Z", action: "Ativo Registrado" }],
  },
];

const Assets = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const getLocationName = (locationId: string) => {
    const location = mockLocations.find(loc => loc.id === locationId);
    return location ? location.name : "Desconhecida";
  };

  const filteredAssets = mockAssets.filter((asset) =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getLocationName(asset.locationId).toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-xl font-semibold">Ativos</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Gerenciar Ativos</h2>
            <p className="text-muted-foreground">
              Visualize, edite e cadastre os equipamentos e ativos da sua empresa.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, código ou localização..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Button className="flex items-center gap-2 w-full md:w-auto" onClick={() => navigate("/assets/new")}>
              <Plus className="h-4 w-4" />
              Novo Ativo
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">{asset.code}</TableCell>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>{getLocationName(asset.locationId)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              asset.status === "Operacional"
                                ? "bg-green-100 text-green-800 hover:bg-green-100/80"
                                : asset.status === "Em Manutenção"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
                                : "bg-red-100 text-red-800 hover:bg-red-100/80"
                            }
                          >
                            {asset.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/assets/${asset.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-4">
                        Nenhum ativo encontrado.
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

export default Assets;