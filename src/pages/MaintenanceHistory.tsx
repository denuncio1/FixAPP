"use client";

import React, { useState, useMemo } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Menu, Search, History, Package, Building2, AlertTriangle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";

// Mock Data para Histórico de Manutenção
interface MaintenanceRecord {
  id: string;
  osId: string;
  asset: string;
  location: string;
  date: string;
  type: "Preventiva" | "Corretiva" | "Preditiva" | "Emergencial";
  technician: string;
  status: "Concluída" | "Cancelada";
  details: string;
}

const mockMaintenanceHistory: MaintenanceRecord[] = [
  {
    id: "REC001",
    osId: "#OS1020",
    asset: "Gerador Principal",
    location: "Armazém Sul",
    date: "2024-10-07",
    type: "Preventiva",
    technician: "Nilson Denuncio",
    status: "Concluída",
    details: "Troca de óleo e filtros. Verificação geral.",
  },
  {
    id: "REC002",
    osId: "#OS1017",
    asset: "Máquina de Produção X",
    location: "Filial Centro",
    date: "2024-10-05",
    type: "Corretiva",
    technician: "Carlos Turibio",
    status: "Concluída",
    details: "Reparo na perna da mesa. Parafusos apertados.",
  },
  {
    id: "REC003",
    osId: "#OS1026",
    asset: "Ar Condicionado Sala A",
    location: "Comércio Local",
    date: "2024-10-28",
    type: "Preventiva",
    technician: "João Silva",
    status: "Concluída",
    details: "Instalação de novo equipamento de climatização.",
  },
  {
    id: "REC004",
    osId: "#OS1029",
    asset: "Veículo Frota B",
    location: "Empresa de Logística",
    date: "2024-11-01",
    type: "Preventiva",
    technician: "João Silva",
    status: "Cancelada",
    details: "Instalação de rastreador cancelada pelo cliente.",
  },
  {
    id: "REC005",
    osId: "#OS1027",
    asset: "Semáforo Av. Principal",
    location: "Prefeitura Municipal",
    date: "2024-10-29",
    type: "Emergencial",
    technician: "Equipe de Emergência",
    status: "Concluída",
    details: "Reparo de emergência no sistema elétrico do semáforo.",
  },
  {
    id: "REC006",
    osId: "#OS1030",
    asset: "Máquina de Produção X",
    location: "Filial Centro",
    date: "2024-09-20",
    type: "Corretiva",
    technician: "Carlos Turibio",
    status: "Concluída",
    details: "Ajuste de correia transportadora.",
  },
];

// Mock Data para Indicadores de Falha Recorrente
interface RecurrentFailureIndicator {
  asset: string;
  failureType: string;
  count: number;
  lastOccurrence: string;
  recommendation: string;
}

const mockRecurrentFailures: RecurrentFailureIndicator[] = [
  {
    asset: "Máquina de Produção X",
    failureType: "Desalinhamento de Componentes",
    count: 3,
    lastOccurrence: "2024-10-05",
    recommendation: "Verificar base de fixação e realizar calibração periódica.",
  },
  {
    asset: "Sistema HVAC-01",
    failureType: "Falha no Compressor",
    count: 2,
    lastOccurrence: "2024-08-01",
    recommendation: "Considerar substituição do compressor ou revisão completa do sistema.",
  },
];

const mockAssets = ["Todos", "Máquina de Produção X", "Gerador Principal", "Ar Condicionado Sala A", "Veículo Frota B", "Semáforo Av. Principal"];
const mockLocations = ["Todas", "Filial Centro", "Armazém Sul", "Comércio Local", "Empresa de Logística", "Prefeitura Municipal"];

const MaintenanceHistory = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("Todos");
  const [selectedLocation, setSelectedLocation] = useState("Todas");

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const filteredHistory = useMemo(() => {
    return mockMaintenanceHistory.filter((record) => {
      const matchesSearch =
        record.osId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.details.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAsset = selectedAsset === "Todos" || record.asset === selectedAsset;
      const matchesLocation = selectedLocation === "Todas" || record.location === selectedLocation;

      return matchesSearch && matchesAsset && matchesLocation;
    });
  }, [searchTerm, selectedAsset, selectedLocation]);

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
          <h1 className="text-xl font-semibold">Histórico de Manutenção</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Histórico Detalhado</h2>
            <p className="text-muted-foreground">
              Visualize o histórico de todas as manutenções realizadas e identifique padrões.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" /> Histórico de Manutenções
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por OS, ativo, técnico ou detalhes..."
                      className="pl-9 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filtrar por Ativo" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAssets.map((asset) => (
                        <SelectItem key={asset} value={asset}>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" /> {asset}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filtrar por Local" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" /> {location}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>OS ID</TableHead>
                      <TableHead>Ativo</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Técnico</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.osId}</TableCell>
                          <TableCell>{record.asset}</TableCell>
                          <TableCell>{record.location}</TableCell>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.type}</TableCell>
                          <TableCell>{record.technician}</TableCell>
                          <TableCell className="text-right">
                            <Badge
                              className={
                                record.status === "Concluída"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100/80"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
                              }
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-4">
                          Nenhum registro de manutenção encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" /> Indicadores de Falha Recorrente
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockRecurrentFailures.length > 0 ? (
                  <ul className="space-y-4">
                    {mockRecurrentFailures.map((failure, index) => (
                      <li key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                        <p className="font-semibold text-lg">{failure.asset}</p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Tipo de Falha:</span> {failure.failureType}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Ocorrências:</span> {failure.count}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Última:</span> {failure.lastOccurrence}
                        </p>
                        <p className="text-sm mt-1">
                          <span className="font-medium">Recomendação:</span> {failure.recommendation}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhum indicador de falha recorrente no momento.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MaintenanceHistory;