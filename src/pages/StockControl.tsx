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
import { Menu, Search, Plus, Boxes, Edit, Trash2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Material } from "@/types/material";

// Mock Data para Materiais
const mockMaterials: Material[] = [
  {
    id: "MAT001",
    name: "Filtro de Óleo (Modelo X)",
    code: "FO-MX-001",
    quantity: 50,
    unit: "unidade",
    minStockLevel: 10,
    location: "Armazém Principal, Prateleira A1",
    supplierId: "SUP001",
    lastUpdated: "2024-11-01T10:00:00Z",
  },
  {
    id: "MAT002",
    name: "Cabo Elétrico 2.5mm²",
    code: "CE-2.5-002",
    quantity: 200,
    unit: "metro",
    minStockLevel: 50,
    location: "Armazém Principal, Prateleira B2",
    supplierId: "SUP002",
    lastUpdated: "2024-10-30T14:30:00Z",
  },
  {
    id: "MAT003",
    name: "Válvula Hidráulica (Tipo Y)",
    code: "VH-TY-003",
    quantity: 5,
    unit: "unidade",
    minStockLevel: 3,
    location: "Armazém Principal, Prateleira C3",
    supplierId: "SUP003",
    lastUpdated: "2024-11-02T09:15:00Z",
  },
  {
    id: "MAT004",
    name: "Graxa Lubrificante (Balde 5kg)",
    code: "GL-5KG-004",
    quantity: 2,
    unit: "balde",
    minStockLevel: 1,
    location: "Armazém Principal, Prateleira D4",
    supplierId: "SUP001",
    lastUpdated: "2024-11-01T11:00:00Z",
  },
  {
    id: "MAT005",
    name: "Parafuso M8x20mm",
    code: "PM8X20-005",
    quantity: 1500,
    unit: "unidade",
    minStockLevel: 200,
    location: "Armazém Principal, Gaveta 12",
    supplierId: "SUP004",
    lastUpdated: "2024-10-28T16:00:00Z",
  },
];

const StockControl = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funções de CRUD mockadas
  const handleAddMaterial = () => {
    // Lógica para adicionar novo material (abrir um diálogo, etc.)
    console.log("Adicionar novo material");
    // Exemplo: Adicionar um material de teste
    const newMaterial: Material = {
      id: `MAT${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      name: "Novo Item de Teste",
      code: `NT-${Math.floor(Math.random() * 1000)}`,
      quantity: 10,
      unit: "unidade",
      minStockLevel: 5,
      location: "Nova Localização",
      lastUpdated: new Date().toISOString(),
    };
    setMaterials((prev) => [...prev, newMaterial]);
    alert("Material de teste adicionado! (Ver console para detalhes)");
  };

  const handleEditMaterial = (id: string) => {
    // Lógica para editar material (abrir um diálogo de edição, etc.)
    console.log("Editar material com ID:", id);
    alert(`Editar material com ID: ${id}`);
  };

  const handleDeleteMaterial = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este material?")) {
      setMaterials((prev) => prev.filter((material) => material.id !== id));
      alert("Material excluído!");
    }
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
          <h1 className="text-xl font-semibold">Controle de Estoque</h1>
        </header>
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">Gestão de Peças e Insumos</h2>
            <p className="text-muted-foreground">
              Visualize, adicione e gerencie todos os itens do seu estoque.
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

            <Button className="flex items-center gap-2 w-full md:w-auto" onClick={handleAddMaterial}>
              <Plus className="h-4 w-4" />
              Novo Material
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Itens em Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Nível Mínimo</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.length > 0 ? (
                    filteredMaterials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.code}</TableCell>
                        <TableCell>{material.name}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              material.quantity <= material.minStockLevel
                                ? "bg-red-100 text-red-800 hover:bg-red-100/80"
                                : "bg-green-100 text-green-800 hover:bg-green-100/80"
                            }
                          >
                            {material.quantity} {material.unit}
                          </Badge>
                        </TableCell>
                        <TableCell>{material.minStockLevel} {material.unit}</TableCell>
                        <TableCell>{material.location}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditMaterial(material.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteMaterial(material.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                        Nenhum material encontrado.
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

export default StockControl;