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
import { Menu, Search, Plus, CalendarCheck, Settings2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";

// Mock Data para Agendamentos de Manutenção
interface MaintenanceSchedule {
  id: string;
  asset: string;
  location: string;
  type: "Preventiva" | "Preditiva";
  schedule: string; // Ex: "Mensal", "A cada 500h de uso"
  lastExecution: string;
  nextExecution: string;
  status: "Agendada" | "Em Atraso" | "Concluída";
}

const mockSchedules: MaintenanceSchedule[] = [
  {
    id: "SCH001",
    asset: "Máquina de Produção X",
    location: "Filial Centro",
    type: "Preventiva",
    schedule: "Mensal",
    lastExecution: "2024-10-15",
    nextExecution: "2024-11-15",
    status: "Agendada",
  },
  {
    id: "SCH002",
    asset: "Gerador Principal",
    location: "Armazém Sul",
    type: "Preditiva",
    schedule: "A cada 500h de uso",
    lastExecution: "2024-09-20",
    nextExecution: "2024-11-25", // Baseado em previsão de uso
    status: "Agendada",
  },
  {
    id: "SCH003",
    asset: "Sistema HVAC-01",
    location: "Escritório Principal",
    type: "Preventiva",
    schedule: "Trimestral",
    lastExecution: "2024-08-01",
    nextExecution: "2024-11-01",
    status: "Em Atraso",
  },
  {
    id: "SCH004",
    asset: "Veículo Frota A",
    location: "Pátio de Manutenção",
    type: "Preventiva",
    schedule: "Semestral",
    lastExecution: "2024-07-10",
    nextExecution: "2025-01-10",
    status: "Agendada",
  },
  {
    id: "SCH005",
    asset: "Sensor de Temperatura 05",
    location: "Filial Centro",
    type: "Preditiva",
    schedule: "Análise de dados",
    lastExecution: "2024-10-20",
    nextExecution: "2024-11-05", // Baseado em alerta de anomalia
    status: "Agendada",
  },
];

const PreventiveMaintenance = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const filteredSchedules = mockSchedules.filter((schedule) =>
    schedule.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.schedule.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-xl font-semibold">Manutenção Preventiva e Preditiva</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Agendamentos de Manutenção</h2>
            <p className="text-muted-foreground">
              Gerencie e visualize os agendamentos de manutenção preventiva e preditiva.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ativo, local ou tipo..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <Button className="flex items-center gap-2 w-full md:w-auto" variant="outline">
                <Settings2 className="h-4 w-4" />
                Configurar Regras
              </Button>
              <Button className="flex items-center gap-2 w-full md:w-auto">
                <Plus className="h-4 w-4" />
                Novo Agendamento
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Próximas Manutenções</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Ativo</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Agendamento</TableHead>
                    <TableHead>Última Execução</TableHead>
                    <TableHead>Próxima Execução</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.length > 0 ? (
                    filteredSchedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell className="font-medium">{schedule.id}</TableCell>
                        <TableCell>{schedule.asset}</TableCell>
                        <TableCell>{schedule.location}</TableCell>
                        <TableCell>{schedule.type}</TableCell>
                        <TableCell>{schedule.schedule}</TableCell>
                        <TableCell>{schedule.lastExecution}</TableCell>
                        <TableCell>{schedule.nextExecution}</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            className={
                              schedule.status === "Agendada"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100/80"
                                : schedule.status === "Em Atraso"
                                ? "bg-red-100 text-red-800 hover:bg-red-100/80"
                                : "bg-green-100 text-green-800 hover:bg-green-100/80"
                            }
                          >
                            {schedule.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-4">
                        Nenhum agendamento encontrado.
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

export default PreventiveMaintenance;