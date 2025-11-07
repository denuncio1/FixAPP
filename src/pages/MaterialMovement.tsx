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
import { Menu, Search, ArrowDownUp, Plus, Minus } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { type MaterialMovement, Material } from "@/types/material";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock Data para Materiais (para seleção)
const mockMaterialsForSelection: Material[] = [
  { id: "MAT001", name: "Filtro de Óleo (Modelo X)", code: "FO-MX-001", quantity: 50, unit: "unidade", minStockLevel: 10, location: "Armazém Principal, Prateleira A1", lastUpdated: "2024-11-01T10:00:00Z" },
  { id: "MAT002", name: "Cabo Elétrico 2.5mm²", code: "CE-2.5-002", quantity: 200, unit: "metro", minStockLevel: 50, location: "Armazém Principal, Prateleira B2", lastUpdated: "2024-10-30T14:30:00Z" },
  { id: "MAT003", name: "Válvula Hidráulica (Tipo Y)", code: "VH-TY-003", quantity: 5, unit: "unidade", minStockLevel: 3, location: "Armazém Principal, Prateleira C3", lastUpdated: "2024-11-02T09:15:00Z" },
];

// Mock Data para Movimentações de Materiais
const initialMaterialMovements: MaterialMovement[] = [
  {
    id: "MOV001",
    materialId: "MAT001",
    materialName: "Filtro de Óleo (Modelo X)",
    type: "Entrada",
    quantity: 20,
    timestamp: "2024-11-01T09:00:00Z",
    responsible: "João Silva",
    reason: "Compra - Pedido #12345",
  },
  {
    id: "MOV002",
    materialId: "MAT002",
    materialName: "Cabo Elétrico 2.5mm²",
    type: "Saída",
    quantity: 10,
    timestamp: "2024-11-01T11:30:00Z",
    responsible: "Maria Souza",
    reason: "Uso em OS #OS1020",
  },
  {
    id: "MOV003",
    materialId: "MAT001",
    materialName: "Filtro de Óleo (Modelo X)",
    type: "Saída",
    quantity: 2,
    timestamp: "2024-11-02T14:00:00Z",
    responsible: "Pedro Costa",
    reason: "Uso em OS #OS1021",
  },
];

const MaterialMovement = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [movements, setMovements] = useState<MaterialMovement[]>(initialMaterialMovements);

  // Estados para o formulário de nova movimentação
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [movementType, setMovementType] = useState<"Entrada" | "Saída">("Entrada");
  const [quantity, setQuantity] = useState<number | string>("");
  const [responsible, setResponsible] = useState("");
  const [reason, setReason] = useState("");

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const filteredMovements = movements.filter((movement) =>
    movement.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movement.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movement.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movement.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMovement = () => {
    if (!selectedMaterialId || !quantity || !responsible || !reason) {
      toast.error("Por favor, preencha todos os campos da movimentação.");
      return;
    }
    if (typeof quantity !== 'number' || quantity <= 0) {
      toast.error("A quantidade deve ser um número positivo.");
      return;
    }

    const material = mockMaterialsForSelection.find(m => m.id === selectedMaterialId);
    if (!material) {
      toast.error("Material selecionado inválido.");
      return;
    }

    const newMovement: MaterialMovement = {
      id: `MOV${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      materialId: selectedMaterialId,
      materialName: material.name,
      type: movementType,
      quantity: quantity,
      timestamp: new Date().toISOString(),
      responsible,
      reason,
    };

    setMovements((prev) => [newMovement, ...prev]);
    toast.success("Movimentação registrada com sucesso!");

    // Resetar formulário
    setSelectedMaterialId("");
    setMovementType("Entrada");
    setQuantity("");
    setResponsible("");
    setReason("");
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
          <h1 className="text-xl font-semibold">Movimentação de Materiais</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Entrada e Saída de Materiais</h2>
            <p className="text-muted-foreground">
              Registre todas as movimentações de estoque para manter o controle preciso.
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDownUp className="h-5 w-5" /> Registrar Nova Movimentação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="material">Material</Label>
                  <Select value={selectedMaterialId} onValueChange={setSelectedMaterialId}>
                    <SelectTrigger id="material">
                      <SelectValue placeholder="Selecione o material" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMaterialsForSelection.map((material) => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name} ({material.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="movementType">Tipo de Movimentação</Label>
                  <Select value={movementType} onValueChange={(value: "Entrada" | "Saída") => setMovementType(value)}>
                    <SelectTrigger id="movementType">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entrada">Entrada</SelectItem>
                      <SelectItem value="Saída">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Ex: 10"
                    value={quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="responsible">Responsável</Label>
                  <Input
                    id="responsible"
                    placeholder="Nome do responsável"
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                  />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="reason">Motivo</Label>
                  <Textarea
                    id="reason"
                    placeholder="Descreva o motivo da movimentação (ex: compra, uso em OS, devolução)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>
              <Button className="mt-4 w-full" onClick={handleAddMovement}>
                Registrar Movimentação
              </Button>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por material, responsável ou motivo..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Movimentações</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead className="text-right">Data/Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.length > 0 ? (
                    filteredMovements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="font-medium">{movement.materialName}</TableCell>
                        <TableCell>
                          {movement.type === "Entrada" ? (
                            <span className="flex items-center text-green-600">
                              <Plus className="h-4 w-4 mr-1" /> Entrada
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600">
                              <Minus className="h-4 w-4 mr-1" /> Saída
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{movement.quantity}</TableCell>
                        <TableCell>{movement.responsible}</TableCell>
                        <TableCell>{movement.reason}</TableCell>
                        <TableCell className="text-right">{formatDateTime(movement.timestamp)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                        Nenhuma movimentação encontrada.
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

export default MaterialMovement;