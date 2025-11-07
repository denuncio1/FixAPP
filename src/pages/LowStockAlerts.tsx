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
import { Menu, Search, BellDot, AlertTriangle, CheckCircle2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { LowStockAlert, Material } from "@/types/material";
import { toast } from "sonner"; // Importação adicionada

// Mock Data para Materiais (para simular estoque real e gerar alertas)
const mockCurrentMaterials: Material[] = [
  { id: "MAT001", name: "Filtro de Óleo (Modelo X)", code: "FO-MX-001", quantity: 8, unit: "unidade", minStockLevel: 10, location: "Armazém Principal, Prateleira A1", lastUpdated: "2024-11-05T10:00:00Z" },
  { id: "MAT002", name: "Cabo Elétrico 2.5mm²", code: "CE-2.5-002", quantity: 60, unit: "metro", minStockLevel: 50, location: "Armazém Principal, Prateleira B2", lastUpdated: "2024-11-05T10:00:00Z" },
  { id: "MAT003", name: "Válvula Hidráulica (Tipo Y)", code: "VH-TY-003", quantity: 2, unit: "unidade", minStockLevel: 3, location: "Armazém Principal, Prateleira C3", lastUpdated: "2024-11-05T10:00:00Z" },
  { id: "MAT004", name: "Graxa Lubrificante (Balde 5kg)", code: "GL-5KG-004", quantity: 1, unit: "balde", minStockLevel: 1, location: "Armazém Principal, Prateleira D4", lastUpdated: "2024-11-05T10:00:00Z" },
  { id: "MAT005", name: "Parafuso M8x20mm", code: "PM8X20-005", quantity: 150, unit: "unidade", minStockLevel: 200, location: "Armazém Principal, Gaveta 12", lastUpdated: "2024-11-05T10:00:00Z" },
];

const LowStockAlerts = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Gerar alertas com base no mockCurrentMaterials
  useMemo(() => {
    const generatedAlerts: LowStockAlert[] = [];
    mockCurrentMaterials.forEach(material => {
      if (material.quantity <= material.minStockLevel) {
        generatedAlerts.push({
          id: `LSA${material.id}`,
          materialId: material.id,
          materialName: material.name,
          currentQuantity: material.quantity,
          minStockLevel: material.minStockLevel,
          timestamp: new Date().toISOString(),
          status: "Ativo",
        });
      }
    });
    setAlerts(generatedAlerts);
  }, []); // Executa apenas uma vez na montagem

  const filteredAlerts = alerts.filter((alert) =>
    alert.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.materialId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: "Resolvido" } : alert
      )
    );
    toast.success(`Alerta ${alertId} marcado como resolvido.`);
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

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
          <h1 className="text-xl font-semibold">Alertas de Estoque</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Notificações de Baixo Estoque</h2>
            <p className="text-muted-foreground">
              Monitore e gerencie alertas de materiais com estoque abaixo do nível mínimo.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por material ou ID..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Alertas Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Estoque Atual</TableHead>
                    <TableHead>Nível Mínimo</TableHead>
                    <TableHead>Data do Alerta</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.length > 0 ? (
                    filteredAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">{alert.materialName}</TableCell>
                        <TableCell>{alert.currentQuantity}</TableCell>
                        <TableCell>{alert.minStockLevel}</TableCell>
                        <TableCell>{formatDateTime(alert.timestamp)}</TableCell>
                        <TableCell className="text-right">
                          <Badge
                            className={
                              alert.status === "Ativo"
                                ? "bg-red-100 text-red-800 hover:bg-red-100/80"
                                : "bg-green-100 text-green-800 hover:bg-green-100/80"
                            }
                          >
                            {alert.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {alert.status === "Ativo" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResolveAlert(alert.id)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" /> Resolver
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                        Nenhum alerta de baixo estoque encontrado.
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

export default LowStockAlerts;