"use client";

import React, { useState } from "react";
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
import { Menu, Search, BellRing, AlertCircle, CheckCircle2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";

// Mock Data para Alertas Inteligentes
interface SmartAlert {
  id: string;
  type: "Temperatura Alta" | "Vibração Anormal" | "Falha Recorrente" | "Nível Baixo de Fluido";
  asset: string;
  location: string;
  description: string;
  timestamp: string;
  status: "Ativo" | "Resolvido" | "Ignorado";
  priority: "Alta" | "Média" | "Baixa" | "Crítica"; // 'Crítica' adicionado aqui
}

const mockAlerts: SmartAlert[] = [
  {
    id: "ALERT001",
    type: "Temperatura Alta",
    asset: "Máquina de Produção X",
    location: "Filial Centro",
    description: "Sensor de temperatura detectou anomalia. Risco de superaquecimento.",
    timestamp: "2024-11-01 10:30",
    status: "Ativo",
    priority: "Alta",
  },
  {
    id: "ALERT002",
    type: "Vibração Anormal",
    asset: "Motor da Esteira 02",
    location: "Armazém Sul",
    description: "Níveis de vibração acima do normal. Possível desgaste de rolamento.",
    timestamp: "2024-11-01 09:45",
    status: "Ativo",
    priority: "Alta",
  },
  {
    id: "ALERT003",
    type: "Falha Recorrente",
    asset: "Sistema HVAC-01",
    location: "Escritório Principal",
    description: "Falha no compressor recorrente nos últimos 3 meses.",
    timestamp: "2024-10-31 16:00",
    status: "Ativo",
    priority: "Média",
  },
  {
    id: "ALERT004",
    type: "Nível Baixo de Fluido",
    asset: "Gerador Principal",
    location: "Armazém Sul",
    description: "Nível de óleo do gerador abaixo do mínimo recomendado.",
    timestamp: "2024-10-30 08:00",
    status: "Resolvido",
    priority: "Média",
  },
  {
    id: "ALERT005",
    type: "Temperatura Alta",
    asset: "Servidor Principal",
    location: "Filial Centro",
    description: "Temperatura da sala do servidor elevada. Verifique o ar condicionado.",
    timestamp: "2024-10-29 14:15",
    status: "Ativo",
    priority: "Crítica",
  },
];

const SmartAlerts = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const filteredAlerts = mockAlerts.filter((alert) =>
    alert.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.type.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-xl font-semibold">Alertas Inteligentes</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Monitoramento de Alertas</h2>
            <p className="text-muted-foreground">
              Visualize e gerencie alertas gerados por sensores IoT e análise de dados.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ativo, local ou descrição..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Alertas Ativos e Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ativo</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.length > 0 ? (
                    filteredAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">{alert.id}</TableCell>
                        <TableCell>{alert.type}</TableCell>
                        <TableCell>{alert.asset}</TableCell>
                        <TableCell>{alert.location}</TableCell>
                        <TableCell>{alert.description}</TableCell>
                        <TableCell>{alert.timestamp}</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            className={
                              alert.status === "Ativo"
                                ? "bg-red-100 text-red-800 hover:bg-red-100/80"
                                : alert.status === "Resolvido"
                                ? "bg-green-100 text-green-800 hover:bg-green-100/80"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
                            }
                          >
                            {alert.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-4">
                        Nenhum alerta encontrado.
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

export default SmartAlerts;